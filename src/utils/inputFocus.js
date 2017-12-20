export const fixedWatch = el => {
  if(document.activeElement.nodeName == 'INPUT'){
    el.style.position = "static";
  } else {
    el.style.position = "fixed";
  }
}