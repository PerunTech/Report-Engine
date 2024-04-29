export const schema = {
    type: 'object',
    properties: {
        aggregateFunctions: {
            type: 'array',
            title: ' ',
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
    aggregateFunctions: {

        'ui:widget': 'checkboxes',

    }
};

