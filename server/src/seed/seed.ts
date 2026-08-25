import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { Video } from "../entities/Video";
import { EngagementEvent, EventType } from "../entities/EngagementEvent";

const PRODUCT_SEED = [
  { name: "Classic Denim Jacket", price: 79.99 },
  { name: "Running Sneakers - Air Flex", price: 119.5 },
  { name: "Wireless Earbuds Pro", price: 149.0 },
  { name: "Minimalist Leather Wallet", price: 39.99 },
  { name: "Ceramic Pour-Over Coffee Set", price: 54.0 },
];

const EVENT_TYPES = [EventType.VIEW, EventType.CLICK, EventType.ADD_TO_CART];

function randomEventType(): EventType {
  const roll = Math.random();
  if (roll < 0.6) return EventType.VIEW;
  if (roll < 0.9) return EventType.CLICK;
  return EventType.ADD_TO_CART;
}

async function seed() {
  await AppDataSource.initialize();
  console.log("Connected. Seeding...");

  const productRepo = AppDataSource.getRepository(Product);
  const videoRepo = AppDataSource.getRepository(Video);
  const eventRepo = AppDataSource.getRepository(EngagementEvent);

  await eventRepo.query('TRUNCATE TABLE "engagement_events" CASCADE');
  await videoRepo.query('TRUNCATE TABLE "videos" CASCADE');
  await productRepo.query('TRUNCATE TABLE "products" CASCADE');

  for (const p of PRODUCT_SEED) {
    const product = await productRepo.save(productRepo.create(p));

    const video = await videoRepo.save(
      videoRepo.create({
        productId: product.id,
        title: `${product.name} - Shoppable Demo`,
        videoUrl: `https://cdn.example.com/videos/${product.id}.mp4`,
      })
    );

    const eventCount = 20 + Math.floor(Math.random() * 60);
    const events = Array.from({ length: eventCount }, () =>
      eventRepo.create({
        videoId: video.id,
        eventType: randomEventType(),
      })
    );
    await eventRepo.save(events);
  }

  console.log("Seed complete.");
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
