import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Product } from "./Product";
import { EngagementEvent } from "./EngagementEvent";

@Entity("videos")
export class Video {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "product_id",
  })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.videos, {
    onDelete: "CASCADE",
  })
  
  @JoinColumn({
    name: "product_id",
  })
  product!: Product;

  @Column({
    name: "video_url",
    type: "varchar",
    length: 500,
  })
  videoUrl!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  title!: string;

  @OneToMany(() => EngagementEvent, (event) => event.video)
  events!: EngagementEvent[];
}
