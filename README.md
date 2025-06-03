# Mailbox Message System

## O que é?

Este sistema implementa um mecanismo de seleção de mensagens baseado em condições e prioridades. Ele é útil para situações como:

- Sistemas de autenticação
- Validação de formulários
- Fluxos de trabalho condicionais
- Respostas automáticas de erros

## Como funciona?

O sistema usa uma estrutura hierárquica de "envelopes" para organizar mensagens por condições:

1. Cada mensagem tem:
   - Um valor (texto)
   - Uma prioridade (número)
   - Uma lista de condições (códigos)

2. As mensagens são organizadas em uma árvore onde:
   - Cada nível representa uma condição
   - As mensagens com múltiplas condições são armazenadas mais profundamente na árvore
   - As mensagens sem condições são armazenadas diretamente nos envelopes

## Exemplo Visual

Digamos que temos estas mensagens:

```
M1: "E-mail não encontrado" - Prioridade 1 - Condição [0]
M2: "Conta suspensa" - Prioridade 1 - Condição [1]
M3: "Muitas tentativas" - Prioridade 2 - Condição [4]
M4: "Conta possivelmente comprometida" - Prioridade 5 - Condições [4, 5, 6]
M5: "Muitas tentativas. Redefina sua senha." - Prioridade 3 - Condições [2, 4]
```

A estrutura de envelopes ficaria assim:

```
Mailbox (Envelope Raiz)
│
├── Condição 0
│   └── M1: "E-mail não encontrado" (Prioridade 1)
│
├── Condição 1
│   └── M2: "Conta suspensa" (Prioridade 1)
│
├── Condição 2
│   └── Condição 4
│       └── M5: "Muitas tentativas. Redefina sua senha." (Prioridade 3)
│
├── Condição 4
│   ├── M3: "Muitas tentativas" (Prioridade 2)
│   └── Condição 5
│       └── Condição 6
│           └── M4: "Conta possivelmente comprometida" (Prioridade 5)
```

## Exemplo de Processamento

Se o usuário inserir as condições `[0, 4]`, o sistema:

1. Verifica o envelope da condição 0:
   - Encontra M1 (Prioridade 1)
   
2. Verifica o envelope da condição 4:
   - Encontra M3 (Prioridade 2)
   
3. Compara as prioridades:
   - M1: Prioridade 1
   - M3: Prioridade 2
   
4. Retorna a mensagem com maior prioridade:
   - **M3: "Muitas tentativas" (Prioridade 2)**

## Exemplo Mais Complexo

Se o usuário inserir as condições `[2, 4, 5, 6]`, o sistema:

1. Verifica o envelope da condição 2:
   - Segue para o envelope da condição 4
   - Encontra M5 (Prioridade 3)
   
2. Verifica o envelope da condição 4:
   - Encontra M3 (Prioridade 2)
   - Segue para o envelope da condição 5
     - Segue para o envelope da condição 6
     - Encontra M4 (Prioridade 5)
   
3. Compara as prioridades:
   - M3: Prioridade 2
   - M4: Prioridade 5
   - M5: Prioridade 3
   
4. Retorna a mensagem com maior prioridade:
   - **M4: "Conta possivelmente comprometida" (Prioridade 5)**

## Como as Mensagens São Adicionadas

Quando adicionamos uma mensagem:

1. Pegamos a primeira condição da lista
2. Verificamos se existe um envelope para essa condição
   - Se não existir, criamos um
3. Removemos essa condição da mensagem
4. Adicionamos a mensagem nesse envelope (recursivamente)
5. Se não houver mais condições, armazenamos a mensagem diretamente no envelope

## Como as Mensagens São Recuperadas

Quando buscamos uma mensagem com um conjunto de condições:

1. Verificamos se há uma mensagem direta no envelope atual
2. Para cada condição na lista de entrada:
   - Verificamos se existe um envelope para essa condição
   - Se existir, buscamos recursivamente nesse envelope
3. Comparamos todas as mensagens encontradas e escolhemos a de maior prioridade
4. Se nenhuma mensagem for encontrada, retornamos a mensagem de erro padrão

---

Este sistema é uma implementação de padrões de projeto Composite e Chain of Responsibility, permitindo uma estrutura flexível para mensagens condicionais priorizadas.
---------------------------------------------------------------------

# Mailbox Message System

## What is it?

This system implements a message selection mechanism based on conditions and priorities. It is useful for situations such as:

- Authentication systems
- Form validation
- Conditional workflows
- Automatic error responses

## How does it work?

The system uses a hierarchical structure of "envelopes" to organize messages by conditions:

1. Each message has:
- A value (text)
- A priority (number)
- A list of conditions (codes)

2. Messages are organized in a tree where:
- Each level represents a condition
- Messages with multiple conditions are stored deeper in the tree
- Messages without conditions are stored directly in envelopes

## Visual Example

Let's say we have these messages:

```
M1: "Email not found" - Priority 1 - Condition [0]
M2: "Account suspended" - Priority 1 - Condition [1]
M3: "Too many attempts" - Priority 2 - Condition [4]
M4: "Account possibly compromised" - Priority 5 - Conditions [4, 5, 6]
M5: "Too many attempts. Reset your password." - Priority 3 - Conditions [2, 4]
```

The envelope structure would look like this:

```
Mailbox (Root Envelope)
│
├── Condition 0
│ └── M1: "Email not found" (Priority 1)
│
├── Condition 1
│ └── M2: "Account suspended" (Priority 1)
│
├── Condition 2
│ └── Condition 4
│ └── M5: "Too many attempts. Reset your password." (Priority 3)
│
├── Condition 4
│ ├── M3: "Too many attempts" (Priority 2)
│ └── Condition 5
│ └── Condition 6
│ └── M4: "Account possibly compromised" (Priority 5)
```

## Processing Example

If the user enters the conditions `[0, 4]`, the system:

1. Checks the envelope of condition 0:
- Finds M1 (Priority 1)

2. Checks the envelope of condition 4:
- Finds M3 (Priority 2)

3. Compares the priorities:
- M1: Priority 1
- M3: Priority 2

4. Returns the message with the highest priority:
- **M3: "Too many attempts" (Priority 2)**

## More Complex Example

If the user enters the conditions `[2, 4, 5, 6]`, the system:

1. Checks the envelope of condition 2:
- Goes to the envelope of condition 4
- Finds M5 (Priority 3)

2. Checks the envelope of condition 4:
- Finds M3 (Priority 2)
- Goes to the envelope of condition 5
- Goes to the envelope of condition 6
- Finds M4 (Priority 5)

3. Compares the priorities:
- M3: Priority 2
- M4: Priority 5
- M5: Priority 3

4. Returns the message with the highest priority:
- **M4: "Account possibly compromised" (Priority 5)**

## How Messages Are Added

When we add a message:

1. We take the first condition from the list
2. We check if an envelope exists for this condition
- If it does not exist, we create one
3. We remove this condition from the message
4. We add the message to this envelope (recursively)
5. If there are no more conditions, we store the message directly in the envelope

## How Messages Are Retrieved

When we fetch a message with a set of conditions:

1. We check if there is a direct message in the current envelope
2. For each condition in the input list:
- We check if an envelope exists for this condition
- If it exists, we recursively search in this envelope
3. We compare all the messages found and choose the one with the highest priority
4. If no message is found, we return the standard error message

---

This system is an implementation of the Composite and Chain of Responsibility design patterns, allowing a flexible structure for prioritized conditional messages.