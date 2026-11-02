package com.careertrack.dto;

import com.careertrack.entity.CompanyVerificationStatus;

public class CompanyVerificationRequest {

    private CompanyVerificationStatus status;
    private String note;

    public CompanyVerificationStatus getStatus() {
        return status;
    }

    public void setStatus(CompanyVerificationStatus status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}