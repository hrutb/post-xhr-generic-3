let base_url = `https://jsonplaceholder.typicode.com`
let post_url  =`${base_url}/posts` ;  




const postContainer= document.getElementById('postContainer');
const postForm= document.getElementById('postForm');
const titleControl= document.getElementById('title');
const bodyControl= document.getElementById('body');

const addPost= document.getElementById('addPost');
const spinner= document.getElementById('spinner');
const updatePost= document.getElementById('updatePost');








function tooltip(){
      $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        })
 }


 function snackbar(msg,icon){
    swal.fire({ 
         title:msg,
         icon:icon ,
         timer:3000
    })
 }



function makeApiCall(method,url,body=null,successCb,errorCb){
         body = body ? JSON.stringify(body) : null ;
          spinner.classList.remove('d-none');
      let xhr = new XMLHttpRequest();
          xhr.open(method,url);
          xhr.send(body); 
        
          xhr.onload = function (){ 
              if(xhr.status>=200 &&  xhr.status<=299){
                   let res = JSON.parse(xhr.response);
                  if(method=== 'GET'){
                     successCb(res);
                       tooltip()
                  } else if(method=== 'POST'){
                         
                    let obj = {...JSON.parse(body),id:res.id};
                        successCb(obj); 
                        tooltip()
 
                  }else if(method==='PATCH' || method === 'PUT'){ 
                                  
                         successCb(JSON.parse(body));          
                           tooltip() 
                   }else{ 
                        successCb();
                        tooltip()                        
                }
                    
                  spinner.classList.add('d-none');
              }else{ 

                 spinner.classList.add('d-none');
                 errorCb(res)
              }
          }

              
         xhr.onerror = function (){  
              spinner.classList.add('d-none');
              errorCb(xhr);
         } 

}

 function createCards(arr){
    let result = ' ';

    arr.forEach(ele=>{ 
        result +=` <div class="col-md-6 mb-5" id=${ele.id}>
                           <div class="card h-100">
                            <div class="card-header"  data-toggle="tooltip" data-placement="top" title="${ele.title}">
                                  <h4>${ele.title}</h4>
                            </div>
                            <div class="card-body">
                                   <h5>${ele.body}</h5>
                            </div>
                            <div class="card-footer d-flex justify-content-between ">
                                <button  onclick="onEdit(this)"  class="btn btn-inline-block btn-outline-primary">Edit</button>
                                <button  onclick="onRemove(this)"  class="btn btn-inline-block btn-outline-danger ">Delete</button>
                             </div>
                        </div>
                    </div>`
    }) ;
    
    postContainer.innerHTML= result;
    
 } 


   makeApiCall('GET', post_url,null, createCards,snackbar);

     function onSubmit(eve){
 
                 eve.preventDefault(); 
        
        let newObj = { 
                 title:titleControl.value ,
                 body:bodyControl.value
               }
      
           makeApiCall('POST',post_url,newObj,createSingleCard,snackbar);
           snackbar('post added successfully..!', 'success');
           postForm.reset();
    
    }








  function createSingleCard(newObj){
         let div= document.createElement('div');
             div.id=  newObj.id;
             div.className =`col-md-6 mb-4`; 
                    div.innerHTML= `<div class="card h-100">
                                    <div class="card-header"  data-toggle="tooltip" data-placement="top" title="${newObj.title}">
                                        <h4>${newObj.title}</h4>
                                    </div>
                                    <div class="card-body">
                                        <h5>${newObj.body}</h5>
                                    </div>
                                    <div class="card-footer d-flex justify-content-between">
                                        <button  onclick="onEdit(this)"  class="btn btn-inline-block btn-outline-primary">Edit</button>
                                        <button  onclick="onRemove(this)"  class="btn btn-inline-block btn-outline-danger ">Delete</button>
                                    </div>
                                </div>` 
         postContainer.prepend(div);
  }  




 function onRemove(ele){ 
       let removeId = ele.closest('.col-md-6').id;
         localStorage.setItem('removeId',removeId);
        let removeUrl = `${post_url}/${removeId}`;
    
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result) => {
            if (result.isConfirmed) { 
                
                makeApiCall('DELETE', removeUrl,null,removePost,snackbar); 
                snackbar('Deleted success...!' ,'success');
                
                }
            }); 


 }





 function removePost(){ 
       let remove =localStorage.getItem('removeId');
       document.getElementById(remove).remove(); 
 }





function onEdit(ele){ 
     let editId= ele.closest('.col-md-6').id;
       localStorage.setItem('editId',editId);
     let editUrl = `${post_url}/${editId}`;

     makeApiCall('GET', editUrl,null,editPost,snackbar);
      window.scrollTo({top:0,behavior:'smooth'});
}



function editPost(editObj){ 
       titleControl.value= editObj.title ;
       bodyControl.value= editObj.body;
 
      addPost.classList.add('d-none');
      updatePost.classList.remove('d-none');

}




function onUpdate(){ 
     let updateId= localStorage.getItem('editId');
     let updateUrl =`${post_url}/${updateId}`; 

     let updateObj = { 
             title:titleControl.value ,
             body:bodyControl.value
          }
 
    
       makeApiCall('PATCH', updateUrl,updateObj,updateSinglePost,snackbar);
       snackbar('Post updated successfully...', 'success');
}




function updateSinglePost(updateObj){ 
  
     let update = localStorage.getItem('editId'); 
   
     let col = document.getElementById(update); 
         col.innerHTML  =`<div class="card h-100">
                                    <div class="card-header"  data-toggle="tooltip" data-placement="top" title="${updateObj.title}">
                                        <h4>${updateObj.title}</h4>
                                    </div>
                                    <div class="card-body">
                                        <h5>${updateObj.body}</h5>
                                    </div>
                                    <div class="card-footer d-flex justify-content-between">
                                        <button  onclick="onEdit(this)"  class="btn btn-inline-block btn-outline-primary">Edit</button>
                                        <button  onclick="onRemove(this)"  class="btn btn-inline-block btn-outline-danger">Delete</button>
                                    </div>
                                </div>`

    
        addPost.classList.remove('d-none');
        updatePost.classList.add('d-none');
        postForm.reset();
        col.scrollIntoView({block:'center',behavior:'smooth'});

}





  postForm.addEventListener('submit', onSubmit); 
  updatePost.addEventListener('click', onUpdate);