  
  export default function debounce (fn, delay)  {
    let tid;
    return (...args) => {
      clearTimeout(tid);
      tid = setTimeout(() => fn(...args), delay);
    };
  };