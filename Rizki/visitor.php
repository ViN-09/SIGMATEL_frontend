<?php

namespace App\Http\Controllers\ttc_teling_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


class visitor extends Controller
{
    protected $connection = 'mysql';
     protected function addVisitorLog($username, $activity)
    {
        try {
            DB::connection($this->connection)
                ->table('user_activity')
                ->insert([
                    'username' => $username,
                    'activity' => $activity,
                    'time' => Carbon::now('Asia/Makassar'),
                ]);
        } catch (\Exception $e) {
            Log::error('Gagal insert user_activity: ' . $e->getMessage());
        }
    }
 public function registvisitor(Request $request)
    {
        try {
            // Validasi input
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'company' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'idType' => 'required|string|max:50',
                'idNumber' => 'required|string|max:100',
                'visitId' => 'required|string|max:50',
                'activity' => 'required|string',
                'workspace' => 'required|string|max:255',
                'signature' => 'required|string', // base64 PNG
            ]);

            // Simpan signature ke storage/app/public/signatures
            $signatureData = str_replace('data:image/png;base64,', '', $validated['signature']);
            $signatureData = str_replace(' ', '+', $signatureData);
            $decoded = base64_decode($signatureData, true);

            if ($decoded === false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Signature invalid'
                ], 400);
            }

            $signatureName = 'signature_' . time() . '.png';
            Storage::disk('public')->put('signatures/' . $signatureName, $decoded);

            // Simpan data ke database
            $id = DB::connection($this->connection)->table('visitors')->insertGetId([
                'name' => $validated['name'],
                'company' => $validated['company'],
                'phone' => $validated['phone'],
                'id_type' => $validated['idType'],
                'id_number' => $validated['idNumber'],
                'visit_id' => $validated['visitId'],
                'activity' => $validated['activity'],
                'ruang_kerja' => $validated['workspace'],
                'signature' => $signatureName,
                'status' => 'pending',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Visitor registered successfully',
                'data' => [
                    'id' => $id,
                    'name' => $validated['name'],
                    'company' => $validated['company'],
                    'phone' => $validated['phone'],
                    'id_type' => $validated['idType'],
                    'id_number' => $validated['idNumber'],
                    'visit_id' => $validated['visitId'],
                    'activity' => $validated['activity'],
                    'ruang_kerja' => $validated['workspace'],
                    'signature' => $signatureName,
                    'status' => 'pending',
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    }