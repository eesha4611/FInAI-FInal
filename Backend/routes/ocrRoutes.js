const express = require("express");
const router = express.Router();
const { ReceiptScan } = require("../models");
const Tesseract = require('tesseract.js');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/"
});

console.log("OCR ROUTES LOADED");

// POST scan single receipt
router.post("/scan", upload.single("receipt"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded"
      });
    }

    const imagePath = require("path").resolve(req.file.path);

    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      "eng",
      {
        logger: m => console.log(m)
      }
    );

    if (!text) {
      return res.json({
        success: false,
        message: "OCR failed to extract text"
      });
    }

    // Normalize text
    const cleanText = text.replace(/,/g, '');
    const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

    let totalCandidates = [];

    // Step 1: Collect total-related lines
    for (let line of lines) {
      const lower = line.toLowerCase();

      if (
        lower.includes("total") ||
        lower.includes("grand total") ||
        lower.includes("net total") ||
        lower.includes("amount payable")
      ) {
        if (lower.includes("sub")) continue;

        const numbers = line.match(/\d+(\.\d+)?/g);

        if (numbers) {
          const value = parseFloat(numbers[numbers.length - 1]);

          if (value > 1 && value < 100000) {
            totalCandidates.push(value);
          }
        }
      }
    }

    let amount = null;

    // Prefer last detected total
    if (totalCandidates.length > 0) {
      amount = totalCandidates[totalCandidates.length - 1];
    }

    // Step 2: Safe fallback — scan bottom 6 lines but ignore time patterns
    if (!amount) {
      const bottomLines = lines.slice(-6);

      for (let line of bottomLines) {

        // Ignore time like 21:18
        if (line.match(/\d{1,2}:\d{2}/)) continue;

        // Ignore percentages
        if (line.includes("%")) continue;

        const numbers = line.match(/\d+(\.\d+)?/g);

        if (numbers) {
          const value = parseFloat(numbers[numbers.length - 1]);

          if (value > 10 && value < 100000) {
            amount = value;
          }
        }
      }
    }

    if (!amount) {
      return res.json({
        success: false,
        message: "Total amount not detected"
      });
    }

    // Save to database
    await ReceiptScan.create({
      amount: amount
    });

    return res.json({
      success: true,
      amount: amount
    });

  } catch (error) {
    console.error("OCR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "OCR processing failed"
    });
  }
});

// GET receipt history
router.get("/history", async (req, res) => {
  try {
    const receipts = await ReceiptScan.findAll({
      order: [["scannedAt", "DESC"]]
    });

    res.json({
      success: true,
      data: receipts.map(r => ({
        id: r.id,
        amount: r.amount,
        scannedAt: r.scannedAt
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
