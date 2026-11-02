package com.careertrack.dto;

import java.util.List;

public class EmployerDashboardResponse {

	private long totalJobs;
	private long activeJobs;
	private long totalApplications;
	private long shortListed;
	
	private List<?> activejobsList;
	private List<?> recentApplications;
	
	private boolean hasCompany;
	
	public EmployerDashboardResponse() {
		
	}

	public long getTotalJobs() {
		return totalJobs;
	}

	public void setTotalJobs(long totalJobs) {
		this.totalJobs = totalJobs;
	}

	public long getActiveJobs() {
		return activeJobs;
	}

	public void setActiveJobs(long activeJobs) {
		this.activeJobs = activeJobs;
	}

	public long getTotalApplications() {
		return totalApplications;
	}

	public void setTotalApplications(long totalApplications) {
		this.totalApplications = totalApplications;
	}

	public long getShortListed() {
		return shortListed;
	}

	public void setShortListed(long shortListed) {
		this.shortListed = shortListed;
	}

	public List<?> getActivejobsList() {
		return activejobsList;
	}

	public void setActivejobsList(List<?> activejobsList) {
		this.activejobsList = activejobsList;
	}

	public List<?> getRecentApplications() {
		return recentApplications;
	}

	public void setRecentApplications(List<?> recentApplications) {
		this.recentApplications = recentApplications;
	}
	
	public boolean isHasCompany() {
        return hasCompany;
    }

    public void setHasCompany(boolean hasCompany) {
        this.hasCompany = hasCompany;
    }
	
}
