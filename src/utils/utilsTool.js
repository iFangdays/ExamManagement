export const findFields = (array,fields,value,children)=>{
    for(let i of array){
        if(i[fields] == value) return i
        if(i[children] && i[children].length > 0){
            let res = findFields(i[children],fields,value,children)
            if(res) return res
        }
    } 
}