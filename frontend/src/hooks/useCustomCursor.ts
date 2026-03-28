import { useEffect } from 'react'

export const useCustomCursor = () => {
  useEffect(() => {
    // Create custom cursor element
    const cursor = document.createElement('div')
    cursor.id = 'cursor'
    document.body.appendChild(cursor)

    let mouseX = 0
    let mouseY = 0

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      cursor.style.left = mouseX - 6 + 'px'
      cursor.style.top = mouseY - 6 + 'px'
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isInteractive(target)) {
        cursor.classList.add('hover')
      }
    }

    const handleMouseLeave = () => {
      cursor.classList.remove('hover')
    }

    const isInteractive = (el: HTMLElement): boolean => {\n      const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL']\n      if (interactiveTags.includes(el.tagName)) return true\n\n      const role = el.getAttribute('role')\n      const interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio']\n      if (role && interactiveRoles.includes(role)) return true\n\n      return el.onclick !== null || el.style.cursor === 'pointer'\n    }

    document.addEventListener('mousemove', moveCursor)\n    document.addEventListener('mouseenter', handleMouseEnter, true)\n    document.addEventListener('mouseleave', handleMouseLeave, true)

    // Add hover detection for interactive elements
    const addHoverListeners = () => {\n      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role=\"button\"], [role=\"link\"], [onclick]')\n      interactiveElements.forEach(el => {\n        el.addEventListener('mouseenter', handleMouseEnter as any)\n        el.addEventListener('mouseleave', handleMouseLeave)\n      })\n    }

    addHoverListeners()

    return () => {\n      document.removeEventListener('mousemove', moveCursor)\n      document.removeEventListener('mouseenter', handleMouseEnter, true)\n      document.removeEventListener('mouseleave', handleMouseLeave, true)\n      cursor.remove()\n    }\n  }, [])\n}\n