# PV.ai - Project TODO

## Phase 1: Architecture & Planning
- [x] Define multi-tenant data model
- [x] Plan generic schema for any business vertical
- [ ] Document API contracts for agents

## Phase 2: Database Schema (Supabase)
- [x] Create generic tables: clientes, produtos_servicos, transacoes_financeiras
- [x] Create generic tables: cobrancas, atendimentos, conversas, eventos, leads, departamentos
- [x] Create aggregated KPI tables: kpis_diarios, financeiro_diario, operacao_diaria, comercial_diario, risco_diario
- [x] Create agents configuration table
- [x] Create logs and observability tables
- [x] Create multi-tenant configuration tables
- [x] Push migrations to Supabase

## Phase 3: Authentication & Users
- [ ] Integrate Manus OAuth
- [ ] Implement user profile management
- [ ] Add role-based access control (RBAC)
- [ ] Create user settings page
- [ ] Add multi-tenant user assignment

## Phase 4: Dashboard & KPIs
- [ ] Design dashboard layout with sidebar navigation
- [ ] Implement daily KPI cards
- [ ] Implement monthly KPI cards
- [ ] Create interactive charts (revenue, volume, conversion)
- [ ] Add date range filters
- [ ] Implement KPI drill-down functionality
- [ ] Add export KPI data button

## Phase 5: AI Agents Interface
- [ ] Create agents management page
- [ ] Design agent chat interface
- [ ] Implement real-time chat with streaming responses
- [ ] Add agent selection dropdown
- [ ] Implement message history
- [ ] Add agent context/personality configuration
- [ ] Create agent performance metrics display

## Phase 6: WhatsApp Integration
- [ ] Design WhatsApp-style message panel
- [ ] Implement message list UI
- [ ] Create message input with formatting
- [ ] Add contact/conversation management
- [ ] Integrate n8n webhooks for message sync
- [ ] Implement message status indicators
- [ ] Add notification system for new messages

## Phase 7: Observability Panel
- [ ] Create logs viewer with filtering
- [ ] Implement real-time log streaming
- [ ] Add execution metadata display
- [ ] Create failure alert system
- [ ] Implement log search functionality
- [ ] Add log export feature
- [ ] Create system health dashboard

## Phase 8: Multi-Tenant Configuration
- [ ] Create company/tenant management page
- [ ] Implement parametrization by business vertical
- [ ] Add custom field configuration
- [ ] Create KPI customization interface
- [ ] Implement data isolation by tenant
- [ ] Add tenant-specific branding options

## Phase 9: n8n Webhook Integration
- [ ] Design webhook receiver endpoints
- [ ] Implement data collection workflow
- [ ] Create data standardization workflow
- [ ] Implement daily aggregation workflow
- [ ] Create monthly aggregation workflow
- [ ] Add webhook testing interface
- [ ] Create workflow status monitoring

## Phase 10: Alert System
- [ ] Create alert configuration interface
- [ ] Implement anomaly detection alerts
- [ ] Add risk detection alerts
- [ ] Create critical event alerts
- [ ] Implement owner notification system
- [ ] Add alert history and management
- [ ] Create alert templates for different scenarios

## Phase 11: Report Export
- [ ] Implement PDF export functionality
- [ ] Create JSON export functionality
- [ ] Design report templates
- [ ] Add scheduled report generation
- [ ] Implement report storage in S3
- [ ] Create report sharing functionality
- [ ] Add report history and versioning

## Phase 12: Testing & Optimization
- [ ] Write unit tests for critical procedures
- [ ] Implement integration tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing
- [ ] Browser compatibility testing
- [ ] Mobile responsiveness testing

## Phase 13: Deployment & Documentation
- [ ] Create comprehensive README
- [ ] Document API endpoints
- [ ] Create setup guide for new tenants
- [ ] Document agent configuration
- [ ] Create troubleshooting guide
- [ ] Prepare GitHub repository
- [ ] Final code review and cleanup

## NEW FEATURE: "Falar com a Equipe IA" - Multi-Agent Chat
- [x] Create agent selector modal with 11 agents
- [x] Refactor CEO chat to generic agent chat system
- [x] Add button to sidebar "Falar com a Equipe IA"
- [x] Implement agent-specific styling and descriptions
- [x] Add back button to return to agent selection
- [ ] Connect to n8n webhooks for real LLM responses
- [ ] Add message persistence to database
- [ ] Test chat functionality end-to-end
