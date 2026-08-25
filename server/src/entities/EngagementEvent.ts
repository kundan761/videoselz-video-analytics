import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from "typeorm";
import { Video } from "./Video";

export enum EventType {
  VIEW = "view",
  CLICK = "click",
  ADD_TO_CART = "add_to_cart",
}

@Entity("engagement_events")
export class EngagementEvent {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "video_id" })
  @Index()
  videoId!: string;

  @ManyToOne(() => Video, (video) => video.events, { onDelete: "CASCADE" })
  @JoinColumn({ name: "video_id" })
  video!: Video;

  @Column({
    name: "event_type",
    type: "enum",
    enum: EventType,
  })
  eventType!: EventType;

  @CreateDateColumn({ name: "timestamp" })
  timestamp!: Date;
}
