import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.ts';
import { currentTenant, requireTenant } from '../middleware/tenant-scope.ts';
import { buildPcapFile, startPcapExtraction } from '../services/evidence-service.ts';

export function createEvidenceRouter(): Router {
  const router = Router();
  router.use('/evidence', authenticate, requireTenant);

  router.get('/evidence/ledger', (req, res) => res.json({ ledger: currentTenant(req).db.evidenceLedger }));

  router.get('/evidence/pcap', (req, res) => res.json({ captures: currentTenant(req).db.pcapCaptures }));

  router.post('/evidence/pcap/start', (req, res) => {
    const capture = startPcapExtraction(currentTenant(req), req.body?.targetIp);
    return res.json({ success: true, capture });
  });

  router.get('/evidence/pcap/download/:id', (req, res) => {
    const { id } = req.params;
    const file = buildPcapFile(id);
    res.setHeader('Content-Type', 'application/vnd.tcpdump.pcap');
    res.setHeader('Content-Disposition', `attachment; filename="${id}.pcap"`);
    res.setHeader('Content-Length', file.length);
    return res.end(file);
  });

  router.get('/evidence/witness', (req, res) => res.json({ witnessNodes: currentTenant(req).db.witnessNodes }));

  return router;
}
