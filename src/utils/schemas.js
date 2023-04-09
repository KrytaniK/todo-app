import * as short from 'short-uuid';

export class Project {
    constructor(options) {
        this.id = short.generate();
        this.name = options.name;
        this.statuses = options.statuses || [];
        this.tasks = options.tasks || [];
    }
}

export class Status {
    constructor(options) {
        this.id = options?.id || short.generate();
        this.name = options?.name || 'New Status';
        this.color = options?.color || 'white';
        if (options?.isTemplate)
            this.isTemplate = options.isTemplate;
    }
}

export class Task {
    constructor(options) {
        this.id = short.generate();
        this.name = options.name || "New Task";
        this.description = options.description || "";
        this.status = options.status;
        this.project = options.project;
        this.priority = options.priority || "Low";
        this.dueDate = options.dueDate || 'unscheduled';
    }
}

export class ContextMenuItem {
    constructor(options = { title: undefined, color: undefined, subOptions: [], callback: () => { } }) {

        const {title, color, subOptions, callback} = options;

        this.id = short.generate();
        this.title = title;
        this.color = color;
        this.options = subOptions;
        this.callback = callback;
    }
}