const width_init = function(elements) {
    for (let element of elements) {
        element.style.width = "228px";
        element.style.background = '#f2f4f7';
        element.querySelector('img').style.width = "228px";
        element.querySelector('img').style.filter = "brightness(100%)";
    }
}
const width_shrink = function(elements, index) {
    for (let [i, element] of elements.entries()) {
        if (i==index) continue;
        element.style.width = "114px";
        element.querySelector('img').style.width = "114px";
        element.querySelector('img').style.filter = "brightness(70%)";
    }
}

window.onload = function() {

    const categories = document.querySelectorAll('.category_container');

    // 홈 카테고리 hover 넓이조정 효과
    for (let [i, cat] of categories.entries()) {
        cat.addEventListener("mouseover", function() {
            cat.style.width = "684px";
            cat.querySelector('img').style.width = '318px';
            width_shrink(categories, i);
            categories[0].style.background = '#E9EDF0';
            categories[1].style.background = '#BED75C';
            categories[2].style.background = '#FCE259';
            categories[3].style.background = '#DEEBF7';
            categories[4].style.background = '#E9AA5D';
        });
        cat.addEventListener("mouseout", function() {
            width_init(categories);
        });
    }
    
}