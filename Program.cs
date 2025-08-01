using System;

namespace AdivinheONumero
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== ADIVINHE O NÚMERO ===");
            Console.WriteLine("O computador escolheu um número entre 1 e 100.");
            Console.WriteLine("Tente adivinhar! Digite 'sair' para encerrar o jogo.\n");

            // Gerar número aleatório entre 1 e 100
            Random random = new Random();
            int numeroSecreto = random.Next(1, 101);
            int tentativas = 0;
            bool acertou = false;

            while (!acertou)
            {
                Console.Write("Digite seu palpite: ");
                string entrada = Console.ReadLine();

                // Verificar se o jogador quer sair
                if (entrada.ToLower() == "sair")
                {
                    Console.WriteLine($"\nVocê desistiu! O número era {numeroSecreto}.");
                    break;
                }

                // Validar se a entrada é um número
                if (!int.TryParse(entrada, out int palpite))
                {
                    Console.WriteLine("Por favor, digite um número válido entre 1 e 100.");
                    continue;
                }

                // Verificar se o palpite está no intervalo válido
                if (palpite < 1 || palpite > 100)
                {
                    Console.WriteLine("Por favor, digite um número entre 1 e 100.");
                    continue;
                }

                tentativas++;

                // Verificar o palpite
                if (palpite == numeroSecreto)
                {
                    acertou = true;
                    Console.WriteLine($"\n🎉 PARABÉNS! Você acertou!");
                    Console.WriteLine($"O número era {numeroSecreto}.");
                    Console.WriteLine($"Você precisou de {tentativas} tentativa(s).");
                }
                else if (palpite < numeroSecreto)
                {
                    Console.WriteLine("❌ O número é MAIOR que " + palpite);
                }
                else
                {
                    Console.WriteLine("❌ O número é MENOR que " + palpite);
                }

                Console.WriteLine(); // Linha em branco para melhor legibilidade
            }

            Console.WriteLine("\nPressione qualquer tecla para sair...");
            Console.ReadKey();
        }
    }
}