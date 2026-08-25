import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { EngagementEvent, EventType } from "../entities/EngagementEvent";
import { Video } from "../entities/Video";

const router = Router();

const VALID_EVENT_TYPES = Object.values(EventType);

router.post("/", async (req: Request, res: Response) => {
  try {
    const { videoId, eventType } = req.body;

    if (!videoId || !eventType) {
      return res
        .status(400)
        .json({ error: "videoId and eventType are required" });
    }

    if (!VALID_EVENT_TYPES.includes(eventType)) {
      return res.status(400).json({
        error: `eventType must be one of: ${VALID_EVENT_TYPES.join(", ")}`,
      });
    }

    const videoRepo = AppDataSource.getRepository(Video);
    const video = await videoRepo.findOneBy({ id: videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const eventRepo = AppDataSource.getRepository(EngagementEvent);
    const event = eventRepo.create({ videoId, eventType });
    await eventRepo.save(event);

    res.status(201).json({
      message: "Event recorded",
      event: {
        id: event.id,
        videoId: event.videoId,
        eventType: event.eventType,
        timestamp: event.timestamp,
      },
    });
  } catch (err) {
    console.error("Error recording event:", err);
    res.status(500).json({ error: "Failed to record event" });
  }
});

export default router;
