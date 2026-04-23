package com.example.maintenance.model;

import java.time.LocalDateTime;

public class RequestNote {

    private Long noteId;
    private Long requestId;
    private Long authorId;
    private String noteText;
    private LocalDateTime createdAt;

    public RequestNote() {}

    public RequestNote(Long noteId, Long requestId, Long authorId, String noteText) {
        this.noteId = noteId;
        this.requestId = requestId;
        this.authorId = authorId;
        this.noteText = noteText;
        this.createdAt = LocalDateTime.now();
    }

    public Long getNoteId() { return noteId; }
    public void setNoteId(Long noteId) { this.noteId = noteId; }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getNoteText() { return noteText; }
    public void setNoteText(String noteText) { this.noteText = noteText; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
