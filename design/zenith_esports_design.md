# Design Document: Zenith Esports

## Project Overview
Zenith Esports is a high-performance web application designed for competitive gaming management, featuring tournament registration, real-time tracking, and administrative control.

## Visual Identity
*   **Primary Palette:** 
    *   Primary: Gradient (#dbb462 to #fbebc4 - Gold/Champagne)
    *   Secondary: Black (#000000)
    *   Accent: White (#FFFFFF)
    *   Neutral: Silver (#C0C0C0)
*   **Typography:**
    *   **Headings:** Agency FB (Bold, authoritative)
    *   **UI/Accents:** Stretch Pro (Modern, tech-focused)
    *   **Body:** Instrument Sans (Clean, legible)
*   **Assets:**
    *   Logo: `zenithesports/assets/logo/logo.png`

## Core Features & User Flows

### 1. Landing Page
*   **Hero Section:** Dynamic, high-impact visuals showcasing the Zenith brand.
*   **Live Stream:** "Live Now" YouTube integration using the YouTube Data API.
*   **Smart CTA:** Automated "Join Now" button that triggers for active tournament windows.

### 2. Authentication
*   **Provider:** Firebase Auth.
*   **Methods:** Email/Password and Google Sign-In.

### 3. User Dashboard (Tournament Registration)
*   **Functionality:** Multi-step or comprehensive form for entering tournament details.
*   **Validation:** Strict checks to prevent duplicate WhatsApp numbers, Player Names, or IDs.
*   **Fields:**
    *   Real Name
    *   Team Name
    *   Team Logo (Upload to Firebase Storage)
    *   WhatsApp Number
    *   Player IDs (Fields for 4-6 players)

### 4. Admin Dashboard
*   **Tournament Management:** Full CRUD (Create, Read, Update, Delete) operations.
*   **Automatic Grouping:** Logic to automatically split teams into groups of 20.
*   **Verification System:** Workflow for "Pending", "Approved", and "Rejected" registration statuses.
*   **Data Export:** CSV export functionality for all registered team data.

### 5. Navigation & Layout
*   **Navbar:** Automated, responsive navigation bar.
*   **Footer:** Detailed footer including social links, legal policies, and a short company description.

## Database Schema (Firebase Firestore)

### Collections:

#### `Users`
*   `uid` (String, PK)
*   `email` (String)
*   `displayName` (String)
*   `photoURL` (String)
*   `role` (String: 'user' | 'admin')

#### `Tournaments`
*   `tournamentID` (String, PK)
*   `title` (String)
*   `description` (String)
*   `startDate` (Timestamp)
*   `status` (String: 'active' | 'completed' | 'upcoming')
*   `maxTeams` (Number)

#### `Registrations`
*   `registrationID` (String, PK)
*   `tournamentID` (String, FK)
*   `teamName` (String)
*   `teamLogoURL` (String)
*   `whatsapp` (String, Unique)
*   `realName` (String)
*   `playerIDs` (Array of Strings, items must be Unique across collection)
*   `status` (String: 'pending' | 'approved' | 'rejected')
*   `groupID` (String, assigned by admin logic)
*   `createdAt` (Timestamp)
