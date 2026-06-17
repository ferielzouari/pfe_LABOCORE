package com.clinisys.labocore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "NotificationLog", schema = "dbo")
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codart;
    private String desart;
    private String supplierName;
    private String supplierEmail;
    private BigDecimal stockLevel;
    private LocalDateTime sentAt;
    private String status;
    private String emailSubject;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String emailBody;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodart() { return codart; }
    public void setCodart(String codart) { this.codart = codart; }

    public String getDesart() { return desart; }
    public void setDesart(String desart) { this.desart = desart; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getSupplierEmail() { return supplierEmail; }
    public void setSupplierEmail(String supplierEmail) { this.supplierEmail = supplierEmail; }

    public BigDecimal getStockLevel() { return stockLevel; }
    public void setStockLevel(BigDecimal stockLevel) { this.stockLevel = stockLevel; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEmailSubject() { return emailSubject; }
    public void setEmailSubject(String emailSubject) { this.emailSubject = emailSubject; }

    public String getEmailBody() { return emailBody; }
    public void setEmailBody(String emailBody) { this.emailBody = emailBody; }
}
