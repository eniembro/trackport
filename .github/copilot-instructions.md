# TrackPort - Container Tracking & Customs Management App

This is a React Native + Expo + TypeScript application for managing shipping containers and customs processes.

## Project Requirements
- **Platform**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Navigation**: Expo Router with file-based routing
- **User Roles**: 5 distinct roles with different permissions
  - `client` - Container owners, create instruction letters
  - `customer_service` - Document validation, account management  
  - `customs_broker` - Upload customs documents, manage clearance
  - `sales` - Client management, rate configuration
  - `main_admin` - Full system access, reports, user management

## Key Features
- Container tracking with 15 status stages
- Instruction letter management with document uploads
- Payment receipt handling (10 payment types)
- Multi-role authentication and authorization
- Admin dashboard with metrics and reporting
- Real-time data synchronization
- Export functionality (Excel reports)

## Development Setup
- Use Expo CLI for development and builds
- Supabase backend configuration required
- Environment variables for API keys
- TypeScript strict mode enabled