# Adivinhe o Número

Um jogo simples de terminal em C# onde você deve adivinhar um número aleatório entre 1 e 100.

## Como Jogar

1. O computador escolhe um número aleatório entre 1 e 100
2. Digite seu palpite
3. O jogo dará dicas: "maior" ou "menor"
4. Continue tentando até acertar
5. Ao final, será mostrado o número de tentativas

## Como Executar

### Pré-requisitos
- .NET 6.0 ou superior instalado

### Compilar e Executar
```bash
# Compilar o projeto
dotnet build

# Executar o jogo
dotnet run
```

### Ou executar diretamente
```bash
dotnet run
```

## Funcionalidades

- ✅ Número aleatório entre 1 e 100
- ✅ Validação de entrada (apenas números válidos)
- ✅ Dicas de "maior" ou "menor"
- ✅ Contagem de tentativas
- ✅ Opção de sair digitando "sair"
- ✅ Interface amigável com emojis

## Exemplo de Jogada

```
=== ADIVINHE O NÚMERO ===
O computador escolheu um número entre 1 e 100.
Tente adivinhar! Digite 'sair' para encerrar o jogo.

Digite seu palpite: 50
❌ O número é MAIOR que 50

Digite seu palpite: 75
❌ O número é MENOR que 75

Digite seu palpite: 62
🎉 PARABÉNS! Você acertou!
O número era 62.
Você precisou de 3 tentativa(s).
```