export default [
  {
    url: "/api/getUsers",
    method: "get",
    response: () => {
      return {
        code: 0,
        message: "ok",
        data: [{name:'张三',sex:'男'},{name:'李四',sex:'女'},{name:'张三',sex:'男'},{name:'李四',sex:'女'}],
      }
    }
  }
]
