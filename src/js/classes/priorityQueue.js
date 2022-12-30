class QueueElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    /**
     * A method that adds an element in the right position of the priority queue using binary insertion
     * @param {QueueElement} element The element to enqueue
     */
    enqueue(element) {
        var leftPointer = 0;
        var rightPointer = this.queue.length - 1;

        // Search for sorted position to using binary search
        while (leftPointer <= rightPointer) {
            const middlePointer = Math.floor((rightPointer + leftPointer) / 2);
            const currentPriority = this.queue[middlePointer].priority;

            if (currentPriority === element.priority) {  // Equal priority
                this.queue.splice(middlePointer, 0, element);
                return;
            }
            else if (element.priority > currentPriority) {  // Greater Priority
                if (middlePointer + 1 < this.queue.length && this.queue[middlePointer + 1].priority >= element.priority) {
                    this.queue.splice(middlePointer + 1, 0, element);
                    return;
                }
                else {
                    leftPointer = middlePointer + 1;
                }
            }
            else {  // Less Priority
                if (middlePointer - 1 > 0 && this.queue[middlePointer - 1].priority <= element.priority) {
                    this.queue.splice(middlePointer, 0, element);
                    return;
                }
                else {
                    rightPointer = middlePointer - 1;
                }
            }
        }

        // Element has lowest priority value in the queue
        if (leftPointer === 0) {
            this.queue.splice(0, 0, element);
        }
        // Element has highest priority value in the queue
        else if (rightPointer === this.queue.length - 1) {
            this.queue.push(element);
        }
    }

    /**
     * A method that returns the element at the front of the queue
     * returns undefined if there are no elements in the queue
     * @returns {QueueElement} The lowest priority element in the queue
     */
    dequeue() {
        if (!this.isEmpty()) {
            return this.queue.shift();
        }
        return undefined;
    }

    /**
     * A method that checks if the queue is empty
     * @returns {boolean} Whether or not the queue is empty
     */
    isEmpty() {
        return (this.queue.length === 0);
    }

}

export { QueueElement, PriorityQueue };

