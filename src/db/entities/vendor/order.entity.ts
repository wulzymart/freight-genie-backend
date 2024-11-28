import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Customer } from "./customer.entity.js";
import { Station } from "./stations.entity.js";
import { OfficePersonnel } from "./office-staff.entity.js";
import { OrderPayment } from "./order-payments.entity.js";
import { Shipment } from "./shipment.entity.js";
import { History } from "./history.entity.js";
import { sign } from "crypto";

export enum OrderType {
  REGULAR = "Regular",
  EXPRESS = "Express",
}
export enum StationOperation {
  LOCAL = "Local",
  INTERSTATION = "Interstation",
}
export enum DeliveryType {
  PICKUP_TO_DOOR = "Pickup to door",
  PICKUP_TO_STATION = "Pickup to station",
  STATION_TO_STATION = "Station to station",
  STATION_TO_DOOR = "Station to door",
}
export enum InterStationOperation {
  REGIONAL = "Regional",
  INTRASTATE = "Intrastate Regions",
  INTERSTATE = "Interstate Regions",
}
export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED= "Accepted",
  SHIPPED = "Shipped",
  TRANSIT = "In Transit",
  DELAYED = "Delayed",
}
@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  trackingNumber: string;
  @Column()
  customerId: string;
  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Relation<Customer>;
  @Column({ type: "enum", enum: OrderType })
  orderType: OrderType;
  @Column()
  originStationId: string;
  @Column({ type: "enum", enum: OrderStatus })
  status: OrderStatus;
  @Column({ type: "enum", enum: StationOperation })
  stationOperation: StationOperation;
  @Column({ type: "enum", enum: InterStationOperation, nullable: true })
  interStationOperation: InterStationOperation;
  @Column({ type: "enum", enum: DeliveryType })
  deliveryType: DeliveryType;
  @ManyToOne(() => Station, (station) => station.generatedOrders)
  originStation: Relation<Station>;
  @ManyToOne(() => Station, (station) => station.incomingOrders, {
    nullable: true,
  })
  destinationStation: Relation<Station>;
  @Column({ nullable: true })
  destinationStationId: string;
  @Column({ nullable: true })
  destinationRegionStationId: string;
  @Column({ type: "simple-json" })
  receiver: {
    address: { stateId: number; address: string };
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  @Column({ type: "simple-json" })
  item: {
    quantity: number;
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
    type: string;
    category: string;
    condition: string;
    description: string;
  };
  @Column({ type: "simple-json" })
  insurance: { insured: boolean; itemValue?: number };
  @Column({ type: "simple-json" })
  additionalCharges: { charge: string; price: number }[];
  @Column({ type: "simple-json" })
  price: {
    freightPrice: number;
    totalAdditionalCharges: number;
    vat: number;
    insurance?: number;
    subTotal: number;
    total: number;
  };
  @Column({type: 'boolean', default: false})
  payOnDelivery: boolean;
  @OneToOne(() => OrderPayment, (orderPayment) => orderPayment.order, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  paymentInfo: Relation<OrderPayment> | null;

  @ManyToOne(() => OfficePersonnel, (personnel) => personnel.orders)
  processedBy: Relation<OfficePersonnel>;
  @ManyToOne(() => Shipment, (shipment) => shipment.orders, { nullable: true })
  shipment: Relation<Shipment> | null;
  @OneToMany(() => History, (history) => history.order, {
    eager: true,
    cascade: true,
  })
  histories: Relation<History>[];
  @Column({ type: "simple-array", nullable: true })
  trackingInfo: {info: string, time: Date}[]
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
