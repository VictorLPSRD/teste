<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requisições OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Arquivo para gerenciar depoimentos via PHP
$commentsFile = '../../comments.json';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Retornar todos os depoimentos
        if (file_exists($commentsFile)) {
            $data = json_decode(file_get_contents($commentsFile), true);
            echo json_encode($data);
        } else {
            echo json_encode(['testimonials' => [], 'pending_testimonials' => []]);
        }
        break;
        
    case 'POST':
        // Adicionar novo depoimento
        $input = json_decode(file_get_contents('php://input'), true);
        
        if ($input) {
            $data = [];
            if (file_exists($commentsFile)) {
                $data = json_decode(file_get_contents($commentsFile), true);
            } else {
                $data = ['testimonials' => [], 'pending_testimonials' => []];
            }
            
            // Criar array para pending_testimonials se não existir
            if (!isset($data['pending_testimonials'])) {
                $data['pending_testimonials'] = [];
            }
            
            // Adicionar aos depoimentos pendentes
            $newTestimonial = [
                'id' => time(),
                'name' => $input['name'] ?? '',
                'email' => $input['email'] ?? '',
                'rating' => intval($input['rating'] ?? 5),
                'comment' => $input['comment'] ?? '',
                'result' => $input['result'] ?? '',
                'date' => date('Y-m-d'),
                'approved' => false
            ];
            
            $data['pending_testimonials'][] = $newTestimonial;
            
            // Salvar arquivo com permissões adequadas
            $jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
            if (file_put_contents($commentsFile, $jsonData, LOCK_EX)) {
                echo json_encode(['status' => 'success', 'message' => 'Depoimento enviado com sucesso!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar depoimento']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Dados inválidos']);
        }
        break;
        
    default:
        echo json_encode(['status' => 'error', 'message' => 'Método não permitido']);
        break;
}
?>
