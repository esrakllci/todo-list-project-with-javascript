// Tüm Elementleri Seçmek
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group")
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){//Tüm event listenerlar
    form.addEventListener("submit",addTodo); // submit butonu yapma
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI); //sayfa yüklendiğinde todo ekleme eventi
    secondCardBody.addEventListener("click",deleteTodo); // tıklandığında todoları arayüzden silme eventi
    filter.addEventListener("keyup",filterTodos); //todolara filtre uygulama eventi keyup olduğunda event çalışır.(klavyeye filtrelenmek istenen harflerin girilmesi)
    clearButton.addEventListener("click",clearAllTodos); //Tüm taskları temizleme eventi
}


// // Aynı Todo için önceden kullandığımız getTodosFromStorage fonksiyonunu kullanın
// let todos = getTodosFromStorage();
//     if(todos.indexOf(newTodo)===-1){
//         addTodoToUI(newTodo);  
//         addTodoToStorage(newTodo);
//         showAlert("success","Başarılı bir şekilde eklendi...")  
//     }
//     else{
//         showAlert("danger","Bu Todo Zaten Kayıtlı");
//     }
function clearAllTodos(e){
    // Arayüzden todoları temizleme

    if(confirm("Tümünü silmek istediğinize emin misiniz?")){ // else'e gerek yok diğer seçenek olursa zaten else durumu gerçekleşmiş olur.

        // todoList.innerHTML = ""; // değerlere boşluk bırakarak silinmesini sağlar fakat bu işlem yavaştır.

        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild); //firstElementchild'a göre silme. firstelementchild silinmişse tüm elemanlar silinme işlemi
        }
        localStorage.removeItem("todos"); //localstoragetaki tüm todoların temizlenmesi

    }

}
function filterTodos(e){
    // filtreleme için klavyeden girilen değeri alma
    const filterValue = e.target.value.toLowerCase();//büyük-küçük harfe duyarlı olmaması adına girilen tüm değerleri küçüğe çevirme işlemi yapıldı.
    const listItems = document.querySelectorAll(".list-group-item"); //arama yapılacak classı seçme
    
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){ // filtervalue değerini buluyorsa 0 bulamadıysa -1
            // Bulamadı

            listItem.setAttribute("style","display : none !important");
        }

        else {
            listItem.setAttribute("style","display : block");
        }


    });

}
// arayüzden todo silme fonksiyonu
function deleteTodo(e){ // e objesi sayesinde sayfada nereye tıklandığı tespit edilebilir.
   
    if(e.target.className === "fa fa-remove"){ //e.target nereye tıklandığını verir.
       e.target.parentElement.parentElement.remove(); // silmek istenen todonun parent elementlerine ulaşmak ve en üstteki parentı silmeyi sağlamak adına bu şekilde yazıldı.
    // Aşağıda gösterilmiştir.
       //<li class="list-group-item d-flex justify-content-between"> 
    //                         Todo 1
    //                         <a href = "#" class = "delete-item">
    //                             <i class = "fa fa-remove"></i>
    //                         </a>

    //                     </li>
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    
       showAlert("success","Todo başarıyla silindi...");
        // console.log(e.target); //target nereye basıldığını verir.
    }
    

}

function deleteTodoFromStorage(deletetodo){ //
    let todos = getTodosFromStorage();
    
    todos.forEach(function(todo,index){
        if (todo === deletetodo){
            todos.splice(index,1); //Arrayden değer silme

        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}
// Sayfa yüklendiğinde todo ekleme
// Bu event sayesinde localstorage'e eklenen tüm todolar sayfa yüklendiğinde
// otomatik olarak arayüzde görüntülenir. Silinmez.
function loadAllTodosToUI(){
    let todos = getTodosFromStorage(); //daha önce yazdığımız fonksiyonu burada çağırdık localstoragetan todo getirmek için

    todos.forEach(function(todo){ //her bir döngüde todo ekleme
        addTodoToUI(todo);
    })
}



function todoControl(newTodo) {
    if (getTodosFromStorage().indexOf(newTodo) === -1) {
        return false;
    }
    return true;
}



function addTodo(e){
    const newTodo = todoInput.value.trim(); //todo inputundaki değerleri alma
    // bu trim sayesinde başta ya da sonda boşluk girilmez.
    // Yani boşluklu değer girilmesini önler.

    // if else bloğu için
    // Eğer todo girişi sağlanmadan butona tıklanırsa todo girin diye alert mesajı gelir.

    if(newTodo === ""){ // if ile newTodo değeri kontrol edilir eğer boşsa Alert ile
        // bilgilendirme mesajı görüntülenir.

        // showAlert(type,message); // alertin türünü ve verdiği mesajı belirtme
        showAlert("danger","Lütfen bir todo girin...");
    }
    
    else if(todoControl(newTodo)){
        showAlert("warning","Böyle bir todo zaten var!");
    }
    else{ //Boş değilse newtodo alanını ver
        addTodoToUI(newTodo); //arayüze newtodo ekleme
        addTodoToStorage(newTodo); //storage'a newtodo ekleme
        showAlert("success","Todo başarıyla eklendi...");
    }
   



    e.preventDefault(); //e'nin default özelliğini önleme, devredışı bırakma
    // tekrardan sayfaya yönlenmemesi için. Bu yüzden en aşağıda yapılır.
    // sayfa çıkışlarında bu yapılır.
}

function getTodosFromStorage(){ //Storage'tan Todoları Alma
    // böyle bir fonksiyon oluşturduk ki her yerde kullanabilelim.
    let todos; //değişken oluşturma

    if(localStorage.getItem("todos") === null){ // localstorage'ta todos değişkeni var mı diye kontrol et yoksa
        // boş değer döndür varsa todos değerini json.parse ile array'e çevir.
        todos = [];

    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;

}
function addTodoToStorage(newTodo){ //Todoları localstorage'e ekle

    let todos = getTodosFromStorage();

    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));//todoları json.stringify ile stringe çevirme


}
function showAlert(type,message){
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;

    alert.textContent = message;

    firstCardBody.appendChild(alert);

    //alert mesajının silinmesi
    // setTimeout ile süre verme
    // function ve ne kadar süre sonra çalışacağı değerlerini alır. Bu örnekte 1 saniye sonra çalışacaktır.

    setTimeout(function(){
        alert.remove();

    },1000); 
}
function addTodoToUI(newTodo){ //String değerini list item olarak UI'a (arayüze) ekleyecek
    // Projelerde işleri fonksiyonlara bölmek daha faydalı olmaktadır.
    // Eğer sadece bir iş yapıyorsa ayrı fonksiyonlara bölmek
    //  Bu yüzden böldük bu kısmı 
   
    // <li class="list-group-item d-flex justify-content-between"> 
    //                         Todo 1
    //                            <a href = "#" class = "delete-item">
    //                             <i class = "fa fa-remove"></i>
    //                         </a>

    //                     </li>

    // List Item oluşturma
    const listItem = document.createElement("li");
    // Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>"

    listItem.className = "list-group-item d-flex justify-content-between";
    // Text Node Ekleme

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);
    // Todo List'e List Item'ı ekleme
    todoList.appendChild(listItem);
    todoInput.value = ""; //Item temizleme 
    // console'da temizleniyor.

}







