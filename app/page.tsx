'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Minus, Plus, List } from 'lucide-react'

export default function SorteioTimes() {
  const [potes, setPotes] = useState<string[]>(['Pote 1', 'Sem pote'])
  const [jogadores, setJogadores] = useState<{ [key: string]: string[] }>({
    'Pote 1': [],
    'Sem pote': []
  })
  const [numTimes, setNumTimes] = useState(2)
  const [jogadoresPorTime, setJogadoresPorTime] = useState(5)
  const [resultado, setResultado] = useState<string[][]>([])
  const [poteSelecionado, setPoteSelecionado] = useState('Pote 1')
  const [mostrarAdicaoEmMassa, setMostrarAdicaoEmMassa] = useState(false)

  const adicionarJogador = (pote: string, nome: string) => {
    if (nome.trim()) {
      setJogadores({
        ...jogadores,
        [pote]: [...jogadores[pote], nome.trim()]
      })
    }
  }

  const adicionarJogadoresEmMassa = (pote: string, nomes: string) => {
    const novosJogadores = nomes.split('\n').filter(nome => nome.trim() !== '')
    setJogadores({
      ...jogadores,
      [pote]: [...jogadores[pote], ...novosJogadores]
    })
  }

  const removerJogador = (pote: string, index: number) => {
    setJogadores({
      ...jogadores,
      [pote]: jogadores[pote].filter((_, i) => i !== index)
    })
  }

  const realizarSorteio = () => {
    const times: string[][] = Array.from({ length: numTimes }, () => [])
    const jogadoresPorPote = potes.map(pote => [...jogadores[pote]])

    potes.forEach((pote, poteIndex) => {
      const jogadoresDoPote = jogadoresPorPote[poteIndex]
      const numJogadoresPorTime = Math.floor(jogadoresDoPote.length / numTimes)

      for (let i = 0; i < numTimes; i++) {
        for (let j = 0; j < numJogadoresPorTime; j++) {
          if (jogadoresDoPote.length > 0) {
            const indexAleatorio = Math.floor(Math.random() * jogadoresDoPote.length)
            times[i].push(jogadoresDoPote.splice(indexAleatorio, 1)[0])
          }
        }
      }
    })

    // Distribuir jogadores restantes
    const jogadoresRestantes = jogadoresPorPote.flat()
    let timeIndex = 0
    while (jogadoresRestantes.length > 0) {
      const indexAleatorio = Math.floor(Math.random() * jogadoresRestantes.length)
      times[timeIndex].push(jogadoresRestantes.splice(indexAleatorio, 1)[0])
      timeIndex = (timeIndex + 1) % numTimes
    }

    setResultado(times)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Sorteio de Times</h1>

      <Card>
        <CardHeader>
          <CardTitle>Configuração de Potes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Número de potes: {potes.length - 1}</span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (potes.length > 2) {
                    const novoPotes = potes.slice(0, -2).concat(['Sem pote']);
                    setPotes(novoPotes);
                    const { [potes[potes.length - 2]]: _, ...restJogadores } = jogadores;
                    setJogadores(restJogadores);
                  }
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const novoPote = `Pote ${potes.length}`;
                  setPotes([...potes.slice(0, -1), novoPote, 'Sem pote']);
                  setJogadores({ ...jogadores, [novoPote]: [] });
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Jogadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Adicionar Individualmente</h3>
              <Select onValueChange={setPoteSelecionado} defaultValue={poteSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um pote" />
                </SelectTrigger>
                <SelectContent>
                  {potes.map((pote) => (
                    <SelectItem key={pote} value={pote}>{pote}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  placeholder="Nome do jogador"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      adicionarJogador(poteSelecionado, e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Button onClick={() => {
                  const input = document.querySelector(`input[placeholder="Nome do jogador"]`) as HTMLInputElement
                  adicionarJogador(poteSelecionado, input.value)
                  input.value = ''
                }}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => setMostrarAdicaoEmMassa(!mostrarAdicaoEmMassa)}
                className="w-full"
              >
                {mostrarAdicaoEmMassa ? 'Ocultar Adição em Massa' : 'Mostrar Adição em Massa'}
                <List className="w-4 h-4 ml-2" />
              </Button>
              {mostrarAdicaoEmMassa && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Adicionar em Massa</h3>
                  <Textarea
                    placeholder="Cole os nomes aqui, um por linha"
                    rows={5}
                  />
                  <Button 
                    className="mt-2"
                    onClick={() => {
                      const textarea = document.querySelector('textarea') as HTMLTextAreaElement
                      adicionarJogadoresEmMassa(poteSelecionado, textarea.value)
                      textarea.value = ''
                    }}
                  >
                    Adicionar Jogadores
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Jogadores por Pote</h3>
            {potes.map((pote) => (
              <div key={pote} className="mb-4">
                <h4 className="text-md font-medium mb-2">{pote}</h4>
                <ul>
                  {jogadores[pote].map((jogador, index) => (
                    <li key={index} className="flex items-center justify-between py-1">
                      <span>{jogador}</span>
                      <Button variant="ghost" size="sm" onClick={() => removerJogador(pote, index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Sorteio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numTimes">Número de Times</Label>
              <Input
                id="numTimes"
                type="number"
                value={numTimes}
                onChange={(e) => setNumTimes(parseInt(e.target.value))}
                min={2}
              />
            </div>
            <div>
              <Label htmlFor="jogadoresPorTime">Jogadores por Time</Label>
              <Input
                id="jogadoresPorTime"
                type="number"
                value={jogadoresPorTime}
                onChange={(e) => setJogadoresPorTime(parseInt(e.target.value))}
                min={1}
              />
            </div>
          </div>
          <Button className="mt-4 w-full" onClick={realizarSorteio}>Realizar Sorteio</Button>
        </CardContent>
      </Card>

      {resultado.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado do Sorteio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resultado.map((time, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Time {index + 1}</h3>
                  <ul>
                    {time.map((jogador, jIndex) => (
                      <li key={jIndex}>{jogador}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

