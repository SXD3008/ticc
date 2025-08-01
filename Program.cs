using System;

namespace AdivinheONumero
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== ADIVINHE O NÚMERO ===");
            Console.WriteLine("O computador escolheu um número entre 1 e 100.");
            Console.WriteLine("Tente adivinhar! Você receberá dicas se o número é maior ou menor.\n");

            // Gerar número aleatório entre 1 e 100
            Random random = new Random();
            int numeroSecreto = random.Next(1, 101);
            
            int tentativas = 0;
            bool acertou = false;

            while (!acertou)
            {
                tentativas++;
                
                Console.Write($"Tentativa {tentativas}: Digite seu palpite (1-100): ");
                
                // Validar entrada do usuário
                if (!int.TryParse(Console.ReadLine(), out int palpite))
                {
                    Console.WriteLine("Por favor, digite um número válido!\n");
                    tentativas--; // Não contar tentativas inválidas
                    continue;
                }

                // Verificar se o palpite está no intervalo válido
                if (palpite < 1 || palpite > 100)
                {
                    Console.WriteLine("Por favor, digite um número entre 1 e 100!\n");
                    tentativas--; // Não contar tentativas inválidas
                    continue;
                }

                // Verificar o palpite
                if (palpite == numeroSecreto)
                {
                    acertou = true;
                    Console.WriteLine($"\n🎉 PARABÉNS! Você acertou!");
                    Console.WriteLine($"O número era: {numeroSecreto}");
                    Console.WriteLine($"Você precisou de {tentativas} tentativa(s).");
                }
                else if (palpite < numeroSecreto)
                {
                    Console.WriteLine("❌ O número é MAIOR que " + palpite + "\n");
                }
                else
                {
                    Console.WriteLine("❌ O número é MENOR que " + palpite + "\n");
                }
            }

            Console.WriteLine("\nPressione qualquer tecla para sair...");
            Console.ReadKey();
        }
    }
}