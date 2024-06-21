export function createFestivalSelector(festivals, onSelect) {
    const selector = document.getElementById('selected-festival');
    const options = document.getElementById('festival-options');
  
    selector.textContent = Object.keys(festivals)[0];
  
    Object.entries(festivals).forEach(([name, file]) => {
      const listItem = document.createElement('li');
      const button = document.createElement('button');
      button.classList.add('dropdown-item');
      button.textContent = name;
      button.addEventListener('click', () => onSelect(name, file));
      listItem.appendChild(button);
      options.appendChild(listItem);
    });
  }