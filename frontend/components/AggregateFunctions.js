export const schema = {
    type: 'object',
    properties: {
        multipleCheckboxes: {
            type: 'array',
            title: 'Aggregate functions',
            items: {
                type: 'string',
                enum: [
                    'MIN',
                    'MAX',
                    'COUNT',
                    'SUM',
                    'AVG'
                ]
            },
            uniqueItems: true
        }
    }
};

export const uiSchema = {
    multipleCheckboxes: {
        'ui:widget': 'checkboxes',
    }
};

