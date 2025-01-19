document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    const scoreElement = document.getElementById('score');
    const itemsContainer = document.getElementById('items-container');
    const bathTub = document.getElementById('bath-tub');
    const resetButton = document.getElementById('reset-game');
    const instructions = document.querySelector('.instructions');
    const hideInstructionsButton = document.getElementById('hide-instructions');

    // Bath items with their correct positions and behaviors
    const bathItems = {
        'rubber-duck': { 
            emoji: '🦆', 
            position: 'float',
            sound: '🌊 Splash!',
            action: 'floats in the water'
        },
        'soap': { 
            emoji: '🧼', 
            position: 'bottom',
            sound: '✨ Scrub scrub!',
            action: 'makes bubbles'
        },
        'shampoo': { 
            emoji: '🧴', 
            position: 'side',
            sound: '💧 Squish!',
            action: 'gets squeezed'
        },
        'towel': { 
            emoji: '🧺', 
            position: 'outside',
            sound: '🌟 Pat pat!',
            action: 'dries you off'
        },
        'brush': { 
            emoji: '🧹', 
            position: 'side',
            sound: '✨ Scrub!',
            action: 'helps clean'
        }
    };

    // Touch event handling
    let isDragging = false;
    let currentDragItem = null;
    let touchOffset = { x: 0, y: 0 };

    // Initialize draggable items
    document.querySelectorAll('.item').forEach(item => {
        // Mouse events
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('click', handleItemClick);

        // Touch events
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd);
    });

    // Add drop zone event listeners
    bathTub.addEventListener('dragover', handleDragOver);
    bathTub.addEventListener('drop', handleDrop);

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const item = e.target;
        
        isDragging = true;
        currentDragItem = item;
        document.body.classList.add('dragging');
        
        const rect = item.getBoundingClientRect();
        touchOffset.x = touch.clientX - rect.left;
        touchOffset.y = touch.clientY - rect.top;
        
        item.classList.add('dragging');
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const item = currentDragItem;
        
        const x = touch.clientX - touchOffset.x;
        const y = touch.clientY - touchOffset.y;
        
        item.style.position = 'fixed';
        item.style.left = x + 'px';
        item.style.top = y + 'px';
    }

    function handleTouchEnd(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.changedTouches[0];
        const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (dropTarget && (dropTarget === bathTub || dropTarget.closest('#bath-tub'))) {
            const rect = bathTub.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            handleDrop({
                preventDefault: () => {},
                clientX: touch.clientX,
                clientY: touch.clientY,
                dataTransfer: {
                    getData: () => currentDragItem.dataset.item
                }
            });
        }
        
        isDragging = false;
        currentDragItem.style.position = '';
        currentDragItem.style.left = '';
        currentDragItem.style.top = '';
        currentDragItem.classList.remove('dragging');
        currentDragItem = null;
        document.body.classList.remove('dragging');
    }

    function createSplash(x, y, text) {
        const splash = document.createElement('div');
        splash.className = 'splash';
        splash.textContent = text;
        splash.style.left = `${x}px`;
        splash.style.top = `${y}px`;
        itemsContainer.appendChild(splash);
        setTimeout(() => splash.remove(), 1000);
    }

    function handleItemClick(e) {
        const itemType = e.target.dataset.item;
        const item = document.querySelector(`.bath-item.${itemType}`);
        if (item) {
            item.classList.add('in-use');
            const rect = item.getBoundingClientRect();
            createSplash(
                rect.left - bathTub.getBoundingClientRect().left,
                rect.top - bathTub.getBoundingClientRect().top,
                bathItems[itemType].sound
            );
            setTimeout(() => item.classList.remove('in-use'), 2000);
        }
    }

    function handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.item);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const itemType = e.dataTransfer.getData('text/plain');
        
        // Create new bath item
        const newItem = document.createElement('div');
        newItem.className = `bath-item ${itemType}`;
        newItem.textContent = bathItems[itemType].emoji;
        
        // Position the item based on its type
        const rect = bathTub.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        newItem.style.left = `${x}px`;
        newItem.style.top = `${y}px`;
        
        // Add to container
        itemsContainer.appendChild(newItem);
        
        // Create splash effect
        createSplash(x, y, bathItems[itemType].sound);
        
        // Update score
        score += 10;
        scoreElement.textContent = score;
        
        // Add click/touch listener for interaction
        newItem.addEventListener('click', () => {
            newItem.classList.add('in-use');
            createSplash(x, y, bathItems[itemType].sound);
            setTimeout(() => newItem.classList.remove('in-use'), 2000);
        });
        
        newItem.addEventListener('touchstart', (e) => {
            e.preventDefault();
            newItem.classList.add('in-use');
            createSplash(x, y, bathItems[itemType].sound);
            setTimeout(() => newItem.classList.remove('in-use'), 2000);
        });
        
        // Position based on item type
        animateItem(newItem, bathItems[itemType].position);
    }

    function animateItem(item, position) {
        const tubRect = bathTub.getBoundingClientRect();
        
        switch(position) {
            case 'float':
                item.style.top = `${tubRect.height * 0.3}px`;
                break;
            case 'bottom':
                item.style.bottom = '10px';
                break;
            case 'side':
                item.style.right = '10px';
                break;
            case 'outside':
                item.style.top = '-30px';
                break;
        }
    }

    // Instructions panel handling
    hideInstructionsButton.addEventListener('click', () => {
        instructions.classList.add('hidden');
    });

    // Reset game
    resetButton.addEventListener('click', () => {
        itemsContainer.innerHTML = '';
        score = 0;
        scoreElement.textContent = score;
        instructions.classList.remove('hidden');
    });
});
