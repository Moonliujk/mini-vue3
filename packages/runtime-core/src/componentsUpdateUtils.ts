export function shouldUpdateComponent(prevVNode, nextVNode) {
    let {props: prevProps} = prevVNode;
    let {props: nextProps} = nextVNode;

    for (let key in prevProps) {
        if (prevProps[key] !== nextProps[key]) return true;
    }

    return false;
}