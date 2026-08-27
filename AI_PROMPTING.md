# AI Prompting Log

I used Claude for this project as a development assistant, mainly for three areas: **database design, analytics query implementation/tuning, and React frontend development**. I used AI to accelerate implementation and explore approaches, but I reviewed the generated code, tested it, and made fixes where necessary.

---

### 1. Database Design

**Context/Task:** Designing the PostgreSQL database schema using TypeORM for the Products, Videos, and EngagementEvents entities. I needed to determine the relationships between the entities, appropriate primary-key types, and how to represent the supported engagement event types.

**Prompt:**

> I need to design the database for this assignment using PostgreSQL and TypeORM. The main entities are Products, Videos, and EngagementEvents. Help me design the TypeORM entities and their relationships based on the assignment requirements. Please suggest appropriate primary key types, foreign-key relationships, and a good way to model the engagement event types. Keep the schema simple and aligned with the assignment rather than overengineering it.

**What I got / what I changed:**
AI helped me scaffold the three TypeORM entities, including UUID primary keys, the relationships between Product → Video → EngagementEvent, and an enum for the engagement event type rather than using an unrestricted text column.

I then reviewed the generated entities against the assignment requirements and verified the relationships, foreign keys, and column definitions myself. I made/validated any necessary adjustments to ensure the schema matched the actual requirements rather than blindly using the generated design.

---

### 2. Query Tuning — Analytics Aggregation

**Context/Task:** Implementing `GET /api/analytics/videos`, which needed to return aggregated views, clicks, and add-to-cart counts for each video, along with pagination.

**Prompt:**

> I need to implement an analytics query for `GET /api/analytics/videos` using PostgreSQL and TypeORM QueryBuilder. I need one result per video with the counts of `view`, `click`, and `add_to_cart` engagement events, along with pagination. The tables are Product, Video, and EngagementEvent. Please show me a correct aggregation approach and explain how to avoid accidentally multiplying event counts when joining the same events table for multiple event types.

**What I got / what I changed:**
The initial approach joined the engagement events separately for different event types, which could multiply rows when a video had multiple types of events. I recognized this as a potential aggregation/cartesian-product problem, particularly because the assignment explicitly warned about incorrect aggregation.

I asked AI to help correct the approach, and we moved to a **single join with conditional aggregation**, using expressions such as `COUNT(CASE WHEN event_type = ... THEN 1 END)` together with `GROUP BY`.

I then tested the query with different event combinations to make sure the counts were correct and ran `tsc --noEmit` to verify that the TypeORM QueryBuilder code and returned values were valid from a TypeScript perspective. I also reviewed the generated SQL/logic rather than relying solely on the AI-generated query.

---

### 3. Frontend — Dashboard, Analytics Table, Funnel Visualization & Traffic Simulation

**Context/Task:** Building the React + Vite + TypeScript frontend. This was the area where I relied most heavily on AI assistance. The frontend needed an analytics table, conversion-rate calculation, a visual funnel indicator for each video, pagination, and a Simulate Traffic interaction. The assignment required CSS Modules rather than Tailwind.

**Prompt:**

> Help me build the frontend for this analytics dashboard using React, Vite, and TypeScript. The backend API already provides aggregated video analytics. I need a clean component structure for the dashboard, including a video analytics table, pagination, conversion-rate calculation, a visual funnel indicator for each row, and a Simulate Traffic button. The assignment requires CSS Modules, so don't use Tailwind. Please keep the components reasonably reusable and explain the important implementation decisions.

**What I got / what I changed:**
This was the part of the project where I used AI assistance the most. AI helped me structure the frontend into components such as `VideoTable`, `FunnelBar`, `Pagination`, and `SimulateTrafficButton`, as well as providing the initial CSS Modules styling and TypeScript implementation.

During implementation, I encountered actual TypeScript/build issues that required debugging. In particular, CSS Module imports and `import.meta.env` were not initially recognized by TypeScript, producing errors such as:

* `Cannot find module './App.module.css'`
* `Property 'env' does not exist on type 'ImportMeta'`

I fixed this by adding the appropriate Vite type declaration through `vite-env.d.ts` with:

`/// <reference types="vite/client" />`

I then re-ran `tsc --noEmit` and `vite build` to verify that the frontend compiled successfully before committing the changes.

I also reviewed the conversion-rate calculation and explicitly handled the divide-by-zero case. I made sure I understood why the calculation was implemented that way because this is business logic that I would need to explain during a code review or interview.

For the **Simulate Traffic** functionality, the implementation selects a random video from the videos already loaded on the current page instead of making another request to obtain a random video ID. This avoids an unnecessary round trip. After simulating the event, the frontend re-fetches the aggregated analytics from the backend so that the displayed metrics come from the actual database state rather than being manually guessed or incremented on the client.

---

### Overall Use of AI

AI was used as a **development aid rather than as a replacement for understanding or verification**.

My usage was heaviest on the **React frontend**, where I used it to accelerate component design, implementation, styling, and debugging. I also used it meaningfully for the **PostgreSQL/TypeORM database design** and for **designing and correcting the analytics aggregation query**.

For the generated code, I reviewed the implementation, checked it against the assignment requirements, fixed TypeScript/build issues myself, and ran type-check/build validation before considering the work complete.
