import { TOPICS } from "src/common/constants/topics";

export const DAPR_SUBSCRIPTIONS = [
  {
    pubsubname: 'order-pubsub',
    topic: TOPICS.ORDER_CREATED,
    route: 'notifications/orders-create',
  },
];
