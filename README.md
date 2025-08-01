# Adivinhe o Número

Um jogo simples de terminal em C# onde você deve adivinhar um número aleatório entre 1 e 100.

## Como jogar

1. O computador escolhe um número aleatório entre 1 e 100
2. Você digita seus palpites
3. O jogo te dá dicas se o número é maior ou menor
4. Continue até acertar!
5. Ao final, você verá quantas tentativas precisou

## Como executar

### Pré-requisitos
- .NET 6.0 ou superior instalado

### Compilar e executar
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
- ✅ Validação de entrada do usuário
- ✅ Dicas de "maior" ou "menor"
- ✅ Contagem de tentativas
- ✅ Interface amigável em português
- ✅ Emojis para melhor experiência visual

## Exemplo de jogo

```
=== ADIVINHE O NÚMERO ===
O computador escolheu um número entre 1 e 100.
Tente adivinhar! Você receberá dicas se o número é maior ou menor.

Tentativa 1: Digite seu palpite (1-100): 50
❌ O número é MAIOR que 50

Tentativa 2: Digite seu palpite (1-100): 75
❌ O número é MENOR que 75

Tentativa 3: Digite seu palpite (1-100): 62
🎉 PARABÉNS! Você acertou!
O número era: 62
Você precisou de 3 tentativa(s).
```