export const setitem =(post)=>{
    localStorage.setItem("already",JSON.stringify(post))
}
export const getitem =()=>{
    const data =localStorage.getItem("already")
    return data ? JSON.parse(data) :[]

}