import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Video } from "../entities/Video";

const router = Router();

router.get("/videos", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string) || 10)
    );
    const offset = (page - 1) * limit;

    const videoRepo = AppDataSource.getRepository(Video);

    const qb = videoRepo
      .createQueryBuilder("video")
      .leftJoin("video.product", "product")
      .leftJoin("video.events", "event")
      .select("video.id", "id")
      .addSelect("video.title", "title")
      .addSelect("video.videoUrl", "videoUrl")
      .addSelect("product.name", "productName")
      .addSelect(
        "COUNT(CASE WHEN event.event_type = 'view' THEN 1 END)",
        "views"
      )
      .addSelect(
        "COUNT(CASE WHEN event.event_type = 'click' THEN 1 END)",
        "clicks"
      )
      .addSelect(
        "COUNT(CASE WHEN event.event_type = 'add_to_cart' THEN 1 END)",
        "conversions"
      )
      .groupBy("video.id")
      .addGroupBy("product.name")
      .orderBy("video.title", "ASC");

    const totalVideos = await videoRepo.count();

    const rows = await qb.offset(offset).limit(limit).getRawMany();

    const data = rows.map((row) => ({
      id: row.id,
      title: row.title,
      videoUrl: row.videoUrl,
      productName: row.productName,
      views: Number(row.views),
      clicks: Number(row.clicks),
      conversions: Number(row.conversions),
    }));

    res.json({
      data,
      pagination: {
        page,
        limit,
        total: totalVideos,
        totalPages: Math.ceil(totalVideos / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Failed to fetch video analytics" });
  }
});

export default router;
