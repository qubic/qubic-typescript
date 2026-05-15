'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { BookOpen, Clock, Code, FileText, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { ContractSummary } from '../lib/api'
import { Sigil } from './sigil'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [contracts, setContracts] = useState<ContractSummary[]>([])
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const router = useRouter()

  const openPalette = useCallback(() => {
    setOpen(true)
    if (loadState === 'idle') {
      setLoadState('loading')
      fetch('/api/contracts')
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status))
          return r.json()
        })
        .then((data: ContractSummary[]) => {
          setContracts(data)
          setLoadState('ok')
        })
        .catch(() => setLoadState('error'))
    }
  }, [loadState])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openPalette()
      }
    }
    function onOpen() {
      openPalette()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('open-command-palette', onOpen)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('open-command-palette', onOpen)
    }
  }, [openPalette])

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      {open && (
        <div
          className="cmd-overlay"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        />
      )}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command palette"
        className="cmd"
        title="Command palette"
      >
        <Dialog.Title className="sr-only">Command palette</Dialog.Title>
        <div className="cmd-input-wrap">
          <Search size={14} className="cmd-icon" />
          <Command.Input placeholder="Search contracts, navigate…" className="cmd-input" />
        </div>
        <Command.List className="cmd-list">
          <Command.Empty className="cmd-empty">
            {loadState === 'error' ? 'Failed to load contracts.' : 'No results found.'}
          </Command.Empty>

          {contracts.length > 0 && (
            <Command.Group heading="Contracts" className="cmd-group">
              {contracts.map((c) => (
                <Command.Item
                  key={c.contractIndex}
                  value={`${c.contractName} ${c.contractIndex}`}
                  onSelect={() => go(`/contract/${c.contractIndex}`)}
                  className="cmd-item"
                >
                  <Sigil name={c.contractName} size={20} />
                  <span className="cmd-item-name">{c.contractName}</span>
                  <span className="cmd-item-meta">
                    #{String(c.contractIndex).padStart(2, '0')} · {c.procedureCount}p ·{' '}
                    {c.functionCount}f
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Navigate" className="cmd-group">
            <Command.Item value="contracts home" onSelect={() => go('/')} className="cmd-item">
              <FileText size={14} className="cmd-nav-icon" />
              <span className="cmd-item-name">Contracts</span>
              <span className="cmd-item-meta">Browse all ABIs</span>
            </Command.Item>
            <Command.Item
              value="epochs history"
              onSelect={() => go('/epochs')}
              className="cmd-item"
            >
              <Clock size={14} className="cmd-nav-icon" />
              <span className="cmd-item-name">Epoch history</span>
              <span className="cmd-item-meta">All snapshots</span>
            </Command.Item>
            <Command.Item
              value="api docs reference"
              onSelect={() => go('/api-docs')}
              className="cmd-item"
            >
              <BookOpen size={14} className="cmd-nav-icon" />
              <span className="cmd-item-name">API Reference</span>
              <span className="cmd-item-meta">REST endpoints</span>
            </Command.Item>
            <Command.Item
              value="source github"
              onSelect={() => {
                setOpen(false)
                window.open('https://github.com/qubic/qubic-typescript', '_blank')
              }}
              className="cmd-item"
            >
              <Code size={14} className="cmd-nav-icon" />
              <span className="cmd-item-name">Source</span>
              <span className="cmd-item-meta">GitHub repository</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
        <div className="cmd-footer">
          <span>
            <kbd>↑↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </Command.Dialog>
    </>
  )
}
