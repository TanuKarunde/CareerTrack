package com.careertrack.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Locale;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ResumeParserService {

    private static final int MAX_FILE_SIZE = 5 * 1024 * 1024;

    public String extractText(byte[] data, String fileName,
                              String contentType) {
        if (data == null || data.length == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Resume file is empty");
        }

        if (data.length > MAX_FILE_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Resume must not exceed 5 MB");
        }

        String name = fileName == null
                ? "" : fileName.toLowerCase(Locale.ROOT);

        try {
            String text;

            if (name.endsWith(".pdf")
                    || "application/pdf".equalsIgnoreCase(contentType)) {
                text = extractPdf(data);
            } else if (name.endsWith(".docx")
                    || (contentType != null
                    && contentType.contains(
                            "wordprocessingml.document"))) {
                text = extractDocx(data);
            } else {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Only PDF and DOCX resumes are supported");
            }

            text = text.replace("\u0000", "")
                       .replaceAll("[\\t ]+", " ")
                       .replaceAll("\\n{3,}", "\n\n")
                       .trim();

            if (text.length() < 50) {
            	throw new ResponseStatusException(
            		    HttpStatus.BAD_REQUEST,
            		    "Could not extract enough text. If this is a scanned PDF, OCR is required."
            		);
            }

            if (text.length() > 100_000) {
                text = text.substring(0, 100_000);
            }

            return text;

        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unable to read this resume file");
        }
    }

    private String extractPdf(byte[] data) throws IOException {
        try (PDDocument document = Loader.loadPDF(data)) {
            return new PDFTextStripper().getText(document);
        }
    }

    private String extractDocx(byte[] data) throws IOException {
        try (XWPFDocument document = new XWPFDocument(
                new ByteArrayInputStream(data));
             XWPFWordExtractor extractor =
                new XWPFWordExtractor(document)) {

            return extractor.getText();
        }
    }
}