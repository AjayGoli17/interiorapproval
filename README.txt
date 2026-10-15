SHILPA INTERIORS - LIVE DEMO (Admin + Project Manager + Client Portal, linked)
================================================================================

FILES (keep all together in one folder)
  index.html            Demo hub. Open THIS one. Switch views or see them side by side.
  interorproject.html   Admin panel (the main data store)
  project-manager.html  Project manager panel
  client-portal.html    Client portal (opens on Mehta Residence by default)
  ipcs-sync.js          Shared data layer that links the three panels

HOST IT (3 steps, free, ~2 minutes)
  1. Go to  https://app.netlify.com/drop
  2. Drag this whole folder onto the page.
  3. Open the link Netlify gives you. Done. (GitHub Pages / Vercel also work.)

RUN IT ON YOUR OWN COMPUTER INSTEAD
  Do not double-click index.html (many browsers block shared storage for local files).
  Instead, open a terminal in this folder and run:   python3 -m http.server 8000
  then visit  http://localhost:8000

HOW TO PRESENT
  - Present from ONE browser (your laptop / screen share). Data lives in that browser,
    so a client opening the same link on their own device sees their own fresh copy.
  - Pick the "Admin <-> Client" view, then click "Demo script" (top right) for a
    7-step story. Click "Reset" before every demo to restore clean sample data.
  - The dropdown at the top switches which client the portal is showing.

WHAT IS LINKED (changes in one panel appear live in the others)
  Designs ............ upload / send / revision / approve   (Admin <-> Portal <-> PM)
  Change requests .... client submits -> Admin approves or rejects -> Portal updates,
                       budget and a draft change-order invoice follow automatically
  Payments ........... Admin invoices/payments -> Portal budget & milestones;
                       client-added milestones -> Admin invoices
  Site tasks ......... PM marks done -> Admin tasks and project progress -> Portal
  Site issues ........ PM <-> Admin
  Materials .......... client approvals are logged in Admin's activity feed + bell
  Project stage / progress / handover date flow from Admin to the others.

GOOD TO KNOW
  - Needs internet for fonts and sample photos (they load from Google / Unsplash).
  - Material choices are stored in the portal; Admin sees them as activity, not as a list.
  - A client's schedule choice like "+3 to 5 days" becomes "+4 days" once Admin holds it.
  - This is a demo prototype: data is stored in the browser (localStorage), not a server.
