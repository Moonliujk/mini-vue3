import { ref } from "../../dist/my-vue3.esm.js";
// 最简单的情况
// template 只有一个 interpolation
// export default {
//   template: `{{msg}}`,
//   setup() {
//     return {
//       msg: "vue3 - compiler",
//     };
//   },
// };


// 复杂一点
// template 包含 element 和 interpolation 
export default {
  template: `<p>{{count}}</p>`,
  setup() {
    const count = window.count = ref(1);
    return {
      count,
    };
  },
};
