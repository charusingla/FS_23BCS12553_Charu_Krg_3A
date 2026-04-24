import { useState } from 'react';
import styles from './Toolbar.module.css';

const Toolbar = ({
  selectedTool,
  onToolChange,
  selectedColor,
  onColorChange,
  selectedWidth,
  onWidthChange,
  roomId,
  emit,
  strokes,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showWidthPicker, setShowWidthPicker] = useState(false);

  const tools = [
    { id: 'pen', label: 'Pen', icon: '✏️' },
    { id: 'highlighter', label: 'Highlighter', icon: '🖍️' },
    { id: 'eraser', label: 'Eraser', icon: '🧹' },
    { id: 'line', label: 'Line', icon: '📏' },
    { id: 'rect', label: 'Rectangle', icon: '▭' },
    { id: 'circle', label: 'Circle', icon: '◯' },
    { id: 'arrow', label: 'Arrow', icon: '→' },
    { id: 'text', label: 'Text', icon: '𝐓' },
  ];

  const colors = [
    '#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4',
    '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#FF8C94', '#A8E6CF', '#FFD93D', '#6BCB77',
  ];

  const widths = [2, 3, 5, 8, 12, 16];

  const handleClearBoard = () => {
    if (confirm('Clear the entire board? This action cannot be undone.')) {
      emit('clear-board', { roomId });
    }
  };

  const handleUndo = () => {
    if (strokes.length > 0) {
      const lastStroke = strokes[strokes.length - 1];
      emit('undo', { roomId, strokeId: lastStroke.id });
    }
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Tools</div>
        <div className={styles.toolGrid}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`${styles.toolBtn} ${selectedTool === tool.id ? styles.active : ''}`}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
            >
              <span className={styles.toolIcon}>{tool.icon}</span>
              <span className={styles.toolTooltip}>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Color</div>
        <div className={styles.colorPicker}>
          <button
            className={styles.colorButton}
            style={{ backgroundColor: selectedColor }}
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Pick color"
          />
          {showColorPicker && (
            <div className={styles.colorGrid}>
              {colors.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorOption} ${selectedColor === color ? styles.selected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onColorChange(color);
                    setShowColorPicker(false);
                  }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Width</div>
        <div className={styles.widthPicker}>
          <div
            className={styles.widthPreview}
            style={{
              height: selectedWidth,
              backgroundColor: selectedColor,
              borderRadius: selectedWidth / 2,
            }}
          />
          <div className={styles.widthSlider}>
            <input
              type="range"
              min="1"
              max="20"
              value={selectedWidth}
              onChange={(e) => onWidthChange(parseInt(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.widthValue}>{selectedWidth}px</span>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Actions</div>
        <div className={styles.actionBtns}>
          <button
            className={styles.actionBtn}
            onClick={handleUndo}
            disabled={strokes.length === 0}
            title="Undo (Ctrl+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 7v6h6M21 17v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 10a7 7 0 0 0-12.4 3.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Undo</span>
          </button>
          <button
            className={`${styles.actionBtn} ${styles.danger}`}
            onClick={handleClearBoard}
            title="Clear board"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
