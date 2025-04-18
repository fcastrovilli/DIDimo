// SPDX-FileCopyrightText: 2025 Forkbomb BV
//
// SPDX-License-Identifier: AGPL-3.0-or-later

package workflow

import (
	"time"
)

const (
	OpenIDTestTaskQueue = "OpenIDTestTaskQueue"
	LogsBaseURL         = "https://www.certification.openid.net/api/log/"
)

// EmailConfig holds the email configuration details
type EmailConfig struct {
	SMTPHost      string
	SMTPPort      int
	Username      string
	Password      string
	SenderEmail   string
	ReceiverEmail string
	Subject       string
	Body          string
	Attachments   map[string][]byte
}

type GenerateYAMLInput struct {
	Variant  string
	Form     any
	FilePath string
}

type StepCIRunnerInput struct {
	FilePath string
	Token    string
}

type StepCIRunnerResponse struct {
	Result map[string]any
}

type WorkflowInput struct {
	Variant  string
	Form     any
	UserMail string
	AppURL   string
}

type LogWorkflowInput struct {
	AppURL   string
	RID      string
	Token    string
	Interval time.Duration
}

type WorkflowResponse struct {
	Message string
	Logs    []map[string]any
}

type LogWorkflowResponse struct {
	Logs []map[string]any
}

type GetLogsActivityInput struct {
	BaseURL string
	RID     string
	Token   string
}

type TriggerLogsUpdateActivityInput struct {
	AppURL     string
	WorkflowID string
	Logs       []map[string]any
}
type LogUpdateRequest struct {
	WorkflowID string           `json:"workflow_id"`
	Logs       []map[string]any `json:"logs"`
}
type SignalData struct {
	Success bool
	Reason  string
}
