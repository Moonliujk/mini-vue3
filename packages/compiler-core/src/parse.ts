import { NodeType } from "./ast";

const enum TypeTag {
    START,
    END,
}

export function baseParse(content: string) {
    const context = createSource(content);
    return createRoot(parseChildren(context, ''));
};

function createSource(content) {
    return {
        source: content
    };
}

function createRoot(children) {
    return {
        children,
        type: NodeType.ROOT,
        helpers: []
    };
}

function parseChildren(context, tag = '') {
    const nodes: any = [];
    let node;
    while (isContinue(context, tag)) {
        const source = context.source;
        if (source.startsWith('{{')) {
            // 解析差值
            node = parseInterpolation(context);
        } else if (source.charAt(0) === '<') {
            if (/^<[a-z]/i.test(source)) {
                // 解析 html 标签
                node = parseElement(context);
            }
        } else {
            node = parseText(context, tag);
        }
        nodes.push(node);
    }
    return nodes;
}

function isContinue(context, tag) {
    const source = context.source;

    if (/^<\/[a-z]/i.test(source) && !source.startsWith(`</${tag}>`)) {
        throw new Error(`end tag don't match start tag: ${tag}`);
    }
    if (tag) {
        return tag && !source.startsWith(`</${tag}>`)
    }

    return !!source;
}

function parseText(context, tag = '') {
    // 'some text'
    let endIndex = context.source.length;
    const endTags = ['{{', `</${tag}>`];
    
    for(let i=0; i<endTags.length; i++) {
        const index = context.source.indexOf(endTags[i]);
        if (index !== -1 && endIndex > index) {
            endIndex = index;
        }
    }
    const content = parseTextData(context, endIndex);

    return {
        type: NodeType.TEXT,
        content
    };
}

function parseTextData(context: any, length) {
    const content = context.source.slice(0, length);
    advancedBy(context, content.length);
    return content;
}

function parseElement(context) {
    const element: any = parseTag(context, TypeTag.START);
    const tag = element.tag;
    element.children = parseChildren(context, tag);
    parseTag(context, TypeTag.END);

    return element;
}

function parseTag(context: any, type: TypeTag) {
    // <div></div>
    const tag = context.source.match(/^<\/?([a-z]+)>/);
    advancedBy(context, tag[0].length);
    if (type === TypeTag.END) return;

    return {
        type: NodeType.ELEMENT,
        tag: tag[1]
    };
}

function parseInterpolation(context) {
    // {{message}}
    const openDelimiter = '{{';
    const closeDelimiter = '}}';

    const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);
    advancedBy(context, openDelimiter.length);
    const rawContentLen = closeIndex - openDelimiter.length;
    const content = parseTextData(context, rawContentLen).trim();
    advancedBy(context, closeDelimiter.length);

    return {
        type: NodeType.INTERPOLATION,
        content: {
            type: NodeType.SIMPLE_EXPRESSION,
            content
        }
    };
}

function advancedBy(context: any, len: number) {
    context.source = context.source.slice(len);
}
