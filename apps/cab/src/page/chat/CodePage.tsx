import { useRef, useState } from 'react'
import { Block, Box, Button, Group, Stack, Text, Title, Icon } from '@ui8kit/core'
import { Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@ui8kit/form'
import { Play, ChevronDown, FileCode } from 'lucide-react'
import { useAppTheme } from '@/hooks/use-theme'
import { useChat } from '@/page/chat/context'

export function CodePage() {
  const { rounded, buttonSize } = useAppTheme()
  const { sendCode } = useChat()
  const [language, setLanguage] = useState<string>('javascript')
  const [openLang, setOpenLang] = useState<boolean>(false)
  const [code, setCode] = useState<string>(`// Type some JavaScript and press Run\nconsole.log('Hello, ui8kit!')`)
  const [output, setOutput] = useState<string>('')
  const langRef = useRef<HTMLDivElement | null>(null)

  const runCode = () => {
    try {
      if (language === 'javascript') {
        // Extremely simple interpreter for demo purposes only
        // eslint-disable-next-line no-new-func
        const fn = new Function(code)
        const logs: string[] = []
        const originalLog = console.log
        ;(console as any).log = (...args: any[]) => {
          logs.push(args.map(String).join(' '))
        }
        try {
          fn()
        } finally {
          ;(console as any).log = originalLog
        }
        const result = logs.join('\n') || '(no output)'
        setOutput(result)
        sendCode(code, result)
      } else {
        setOutput('Only JavaScript demo is supported in this example.')
        sendCode(code, 'Only JavaScript demo is supported in this example.')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setOutput(`Error: ${message}`)
      sendCode(code, `Error: ${message}`)
    }
  }

  return (
    <Box w="full">
      <Stack gap="lg">
        <Title size="xl" c="secondary-foreground" mt="lg">Code interpreter</Title>

        <Block p="md" rounded={rounded?.default} bg="card" border="1px">
          <Stack gap="md">
            <Group justify="between" align="center">
              <Box w="auto" className="relative min-w-36" ref={langRef as any}>
                <Select className="hidden" value={language} onChange={() => {}} />
                <SelectTrigger onClick={() => setOpenLang((v) => !v)}>
                  <SelectValue value={language} placeholder="Language" />
                  <Icon size="sm" c="secondary-foreground" component="span" lucideIcon={ChevronDown} className="ml-2" />
                </SelectTrigger>
                {openLang && (
                  <SelectContent className="absolute left-0 top-full bg-card">
                    <SelectItem value="javascript" onClick={(v) => { setLanguage(v); setOpenLang(false); }}>JavaScript</SelectItem>
                  </SelectContent>
                )}
              </Box>
              <Button variant="secondary" size={buttonSize.default} rounded={rounded.button} onClick={runCode}>
                <Icon component="span" lucideIcon={Play} />
                <Text size="sm" c="secondary-foreground">Run</Text>
              </Button>
            </Group>

            <Textarea rows={10} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Write code here..." />

            <Block p="md" rounded={rounded?.default} bg="secondary" border="1px">
              <Group align="center" gap="sm">
                <Icon component="span" lucideIcon={FileCode} />
                <Text size="sm" c="secondary-foreground">Output</Text>
              </Group>
              <Box mt="sm">
                <Text size="sm">{output || '(no output)'}</Text>
              </Box>
            </Block>
          </Stack>
        </Block>
      </Stack>
    </Box>
  )
}


