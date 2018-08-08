const { RabbitmqEventBus } = require('../port/adapter/rabbitmqEventBus');

class EventAggregator extends RabbitmqEventBus {}

module.exports = EventAggregator;
