using System;

namespace AdivinheONumero
{
    class Program
    {
        static void Main(string[] args)
        {
            Random random = new Random();
            int numeroSecreto = random.Next(1, 101); // Gera número entre 1 e 100 (inclusive)
            int tentativas = 0;
            int palpite = 0;

            Console.WriteLine("===== Adivinhe o Número =====");
            Console.WriteLine("Tente adivinhar um número entre 1 e 100.\n");

            while (palpite != numeroSecreto)
            {
                Console.Write("Seu palpite: ");
                string entrada = Console.ReadLine();

                if (!int.TryParse(entrada, out palpite))
                {
                    Console.WriteLine("Por favor, digite um número válido.\n");
                    continue;
                }

                tentativas++;

                if (palpite < numeroSecreto)
                {
                    Console.WriteLine("Maior!\n");
                }
                else if (palpite > numeroSecreto)
                {
                    Console.WriteLine("Menor!\n");
                }
            }

            Console.WriteLine($"Parabéns! Você acertou em {tentativas} tentativa{(tentativas > 1 ? "s" : "")}.");
        }
    }
}