import { useRef, useState } from 'react';
import '../styles/TaskModal.css';

interface ElasticSearchItem {
  id: string;
  displayText: string;
  name: string,
  initials: string,
  color: string,
  type: string,
  status: string,
  completedAt: string
}

interface ElasticSearchProps<T extends ElasticSearchItem> {
  items: T[];
  placeholder?: string;
  filterFn?: (item: T, searchTerm: string) => boolean;
  renderItem?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  defaultVisible?: boolean;
}

export default function ElasticSearch<T extends ElasticSearchItem>({
  items,
  placeholder = 'Введите имя куратора...',
  filterFn,
  renderItem,
  emptyMessage = 'Ничего не найдено',
  defaultVisible = true,
}: ElasticSearchProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListVisible, setIsListVisible] = useState(defaultVisible);

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    
    const term = searchTerm.trim().toLowerCase();
    if (filterFn) {
      return filterFn(item, term);
    }
    return item.displayText.toLowerCase().includes(term);
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (!isListVisible) setIsListVisible(true);
  };

  const handleFocus = () => {
    setIsListVisible(true);
  };

  return (
    <div className={`elastic-search`}>
      <div className="search-input-wrapper">
        <img 
          src="/images/search.svg" 
          alt="Лупа"
          className="search-icon"
        />
        <input
          ref={inputRef}
          className="elastic-search-input"
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
      </div>
      {isListVisible && (
        <ul className={`elastic-search-list`}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                className={`elastic-search-item`}
                style={{
                  display: searchTerm && !filteredItems.includes(item) ? 'none' : 'block'
                }}
              >
                {renderItem ? renderItem(item) : item.displayText}
              </li>
            ))
          ) : (
            <li className="elastic-search-empty">{emptyMessage}</li>
          )}
        </ul>
      )}
    </div>
  );
}