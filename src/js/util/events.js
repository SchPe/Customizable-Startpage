
let topics = new Map();

const events = {
    subscribe(topic, handler) {
        if(!topics.has(topic)) topics.set(topic, new Set())
        topics.get(topic).add(handler)
    },
    publish(topic, data) {
        if(!topics.has(topic) || topics.get(topic).size < 1) return;
        for(let handler of topics.get(topic)) handler(data || {})
    },
    remove(topic) {
        topics.delete(topic)
    },
    clear() {
        topics.clear()
    }
}

export default events